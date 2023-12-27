const {Router} = require('express');
const generateProducts = require('../utils/mock');
const router = Router();

router.get('/mockingproducts', async (req, res) => {
    try {
        const numProducts = 3000
        const products = generateProducts(numProducts);
        res.json({payload: products});
    } catch (error) {
        req.logger.error(error)
        res.status(500).json({status:'error', error: error})
    }
});

module.exports = router;