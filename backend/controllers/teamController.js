// controllers/teamController.js
const Team = require('../models/teamModel');
const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');

exports.createTeam = asyncHandler(async (req, res) => {
  const { name, description, members, initialTasks } = req.body;
  
  try {
    // Input validation
    if (!name?.trim() || !description?.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and description are required' 
      });
    }

    // Initialize members array with creator as admin
    let teamMembers = [{
      user: req.user._id,
      role: 'admin'
    }];

    // Process initial tasks
    const validTasks = initialTasks && Array.isArray(initialTasks) 
      ? initialTasks
          .filter(task => task.title && task.description)
          .map(task => ({
            title: task.title.trim(),
            description: task.description.trim(),
            status: 'pending',
            assignedTo: task.assignedTo || null,
            createdBy: req.user._id
          }))
      : [];

    // Add selected members
    if (members && Array.isArray(members)) {
      const uniqueMembers = [...new Set(members)];
      const existingUsers = await User.find({
        _id: { $in: uniqueMembers }
      });

      // Add valid members to the team
      const validMembers = existingUsers.map(user => ({
        user: user._id,
        role: 'member'
      }));

      teamMembers = [...teamMembers, ...validMembers];
    }

    // Create team
    const team = await Team.create({
      name: name.trim(),
      description: description.trim(),
      createdBy: req.user._id,
      members: teamMembers,
      initialTasks: validTasks
    });

    // Populate with explicit population
    const populatedTeam = await Team.findById(team._id)
      .populate({
        path: 'members.user',
        select: 'username email', // Changed from name to username
        model: 'User'
      })
      .populate({
        path: 'createdBy',
        select: 'username email', // Changed from name to username
        model: 'User'
      })
      .populate({
        path: 'initialTasks.assignedTo',
        select: 'username email', // Changed from name to username
        model: 'User'
      })
      .lean();

    res.status(201).json({ 
      success: true, 
      data: populatedTeam 
    });
    
  } catch (error) {
    console.error('Team creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating team',
      error: error.message 
    });
  }
});

// Add new controller methods
exports.getTeamById = asyncHandler(async (req, res) => {
  const { teamId } = req.params;

  const team = await Team.findById(teamId)
    .populate('members.user', 'username email') // Changed from name to username
    .populate('createdBy', 'username email') // Changed from name to username
    .populate('initialTasks.assignedTo', 'username email'); // Changed from name to username

  if (!team) {
    return res.status(404).json({
      success: false,
      message: 'Team not found'
    });
  }

  res.json({
    success: true,
    data: team
  });
});

exports.getTeamTasks = asyncHandler(async (req, res) => {
  const { teamId } = req.params;

  const team = await Team.findById(teamId)
    .populate('initialTasks.assignedTo', 'name email')
    .select('initialTasks');

  if (!team) {
    return res.status(404).json({
      success: false,
      message: 'Team not found'
    });
  }

  res.json({
    success: true,
    data: team.initialTasks
  });
});

// Update the getTeams method to properly handle user data
exports.getTeams = asyncHandler(async (req, res) => {
  try {
    const teams = await Team.find({
      $or: [
        { 'members.user': req.user._id },
        { createdBy: req.user._id }
      ]
    })
    .populate({
      path: 'members.user',
      select: 'username email', // Changed from name to username
      model: 'User'
    })
    .populate({
      path: 'createdBy',
      select: 'username email', // Changed from name to username
      model: 'User'
    })
    .populate({
      path: 'initialTasks.assignedTo',
      select: 'username email', // Changed from name to username
      model: 'User'
    })
    .lean();

    const populatedTeams = await Promise.all(teams.map(async (team) => {
      // Get creator details
      const creator = await User.findById(team.createdBy).select('username email').lean();
      
      // Get member details
      const memberDetails = await Promise.all(team.members.map(async (member) => {
        const user = await User.findById(member.user).select('username email').lean();
        return {
          user: user ? {
            _id: user._id,
            username: user.username,
            email: user.email
          } : null,
          role: member.role
        };
      }));

      // Get assignee details for tasks
      const tasksWithAssignees = await Promise.all((team.initialTasks || []).map(async (task) => {
        const assignee = task.assignedTo ? 
          await User.findById(task.assignedTo).select('username email').lean() : 
          null;
        
        return {
          ...task,
          assignedTo: assignee ? {
            _id: assignee._id,
            username: assignee.username,
            email: assignee.email
          } : null
        };
      }));

      return {
        ...team,
        createdBy: creator ? {
          _id: creator._id,
          username: creator.username,
          email: creator.email
        } : null,
        members: memberDetails.filter(member => member.user),
        initialTasks: tasksWithAssignees
      };
    }));

    res.json({ 
      success: true, 
      data: populatedTeams 
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching teams',
      error: error.message
    });
  }
});

exports.joinTeam = asyncHandler(async (req, res) => {
  const { teamId } = req.params;
  
  // Validate teamId
  if (!teamId || !teamId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid team ID format' 
    });
  }

  const team = await Team.findById(teamId);
  if (!team) {
    return res.status(404).json({ 
      success: false, 
      message: 'Team not found' 
    });
  }

  // Check if team is at capacity (optional)
  if (team.members.length >= 10) {
    return res.status(400).json({ 
      success: false, 
      message: 'Team is at maximum capacity' 
    });
  }

  const isMember = team.members.some(member => 
    member.user.toString() === req.user._id.toString()
  );

  if (isMember) {
    return res.status(400).json({ 
      success: false, 
      message: 'You are already a member of this team' 
    });
  }

  team.members.push({ user: req.user._id, role: 'member' });
  await team.save();

  // Return populated team data with username
  const populatedTeam = await Team.findById(teamId)
    .populate({
      path: 'members.user',
      select: 'username email',
      model: 'User'
    });

  res.json({ 
    success: true, 
    data: populatedTeam 
  });
});

// Add new endpoint to get available users
exports.getAvailableUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
    .select('username email')
    .limit(50);
  
  res.json({ 
    success: true, 
    data: users 
  });
});