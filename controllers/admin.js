const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  console.log('request',req.body);
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Product');
      res.status(201).json(result);
      // res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  //console.log('request',req);
  const editMode = req.query.edit === 'true';
  if (!editMode) {
    return res.status(404).json({ message: 'Edit mode not enabled' });
  }
  // const editMode = req.query.edit;
  // if (!editMode) {
  //   res.status(404).json({ message: 'Product not found!' });
  // }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        res.status(404).json({ message: 'Product not found!' });
      }
      res.status(200).json({product});
      // res.render('admin/edit-product', {
      //   pageTitle: 'Edit Product',
      //   path: '/admin/edit-product',
      //   editing: editMode,
      //   product: product
      // });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.status(200).json(result);
      // res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      res.status(200).json({ prods: products });
      // console.log(products);
      // res.render('admin/products', {
      //   prods: products,
      //   pageTitle: 'Admin Products',
      //   path: '/admin/products'
      // });
    })
    .catch(err => res.status(500).json({ error: err.message }));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.status(200).json({ message: 'Product deleted successfully' });
      // res.redirect('/admin/products');
    })
    .catch(err => res.status(500).json({ error: err.message }));
};
