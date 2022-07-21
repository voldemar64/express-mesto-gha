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
router.put('/:cardId/likes', cardIdValidation, likeCard);
router.delete('/:cardId/likes', cardIdValidation, dislikeCard);
router.delete('/:cardId', cardIdValidation, deleteCard);

module.exports = router;
