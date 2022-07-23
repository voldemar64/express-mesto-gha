const router = require('express').Router();
const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const {
  cardValidation,
  cardIdValidation,
} = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', cardValidation, createCard);
router.put('/:id/likes', cardIdValidation, likeCard);
router.delete('/:id/likes', cardIdValidation, dislikeCard);
router.delete('/:id', cardIdValidation, deleteCard);

module.exports = router;
