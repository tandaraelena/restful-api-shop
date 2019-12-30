const express = require('express');
const router = express.Router();
const multer = require('multer');

const checkAuth = require('../middleware/check-auth')
const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
  destination: (req, file, cb) => 
  {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    // accept the file
    cb(null, true);
  } else {
    // reject the file
    cb(null, false);
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter
});

router.get('/', ProductsController.products_get_all);

router.post("/", checkAuth, upload.single("productImage"), ProductsController.products_post_one);

router.get('/:productId', ProductsController.products_get_one);

router.patch('/:productId', checkAuth, ProductsController.products_patch_one);

router.delete('/:productId', checkAuth, ProductsController.products_delete_one);

module.exports = router;
