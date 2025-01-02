// routes/workspaceRoutes.js
router.get('/workspaces/:teamId', protect, getWorkspace);
router.post('/comments', protect, addComment);
router.post('/tasks', protect, createTask);