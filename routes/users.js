const router = require('express').Router();
const {
  getUsers,
  getCurrentUser,
  createUser,
  patchUser,
  patchAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getCurrentUser);
router.post('/', createUser);
router.patch('/me', patchUser);
router.patch('/me/avatar', patchAvatar);

module.exports = router;
