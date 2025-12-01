const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary').cloudinary;

// Listar imágenes de perfil
router.get('/profile-pictures', async (req, res) => {
    try {
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'mascotas/profile-pictures/',
            max_results: 100
        });
        
        res.json({
            total: result.resources.length,
            imagenes: result.resources.map(img => ({
                public_id: img.public_id,
                url: img.secure_url,
                created_at: img.created_at,
                format: img.format,
                width: img.width,
                height: img.height,
                size: img.bytes
            }))
        });
    } catch (error) {
        console.error('Error al obtener imágenes:', error);
        res.status(500).json({ error: 'Error al obtener imágenes' });
    }
});

// Listar imágenes de productos
router.get('/productos', async (req, res) => {
    try {
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'mascotas/productos/',
            max_results: 100
        });
        
        res.json({
            total: result.resources.length,
            imagenes: result.resources.map(img => ({
                public_id: img.public_id,
                url: img.secure_url,
                created_at: img.created_at,
                format: img.format,
                width: img.width,
                height: img.height,
                size: img.bytes
            }))
        });
    } catch (error) {
        console.error('Error al obtener imágenes:', error);
        res.status(500).json({ error: 'Error al obtener imágenes' });
    }
});

// Obtener estadísticas de uso
router.get('/stats', async (req, res) => {
    try {
        const usage = await cloudinary.api.usage();
        
        res.json({
            plan: usage.plan,
            credits: {
                used: usage.credits.used,
                limit: usage.credits.limit,
                percentage: ((usage.credits.used / usage.credits.limit) * 100).toFixed(2) + '%'
            },
            storage: {
                used: (usage.storage.used / 1024 / 1024).toFixed(2) + ' MB',
                limit: (usage.storage.limit / 1024 / 1024).toFixed(2) + ' MB'
            },
            bandwidth: {
                used: (usage.bandwidth.used / 1024 / 1024).toFixed(2) + ' MB',
                limit: (usage.bandwidth.limit / 1024 / 1024).toFixed(2) + ' MB'
            },
            resources: usage.resources,
            transformations: usage.transformations.usage
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
});

// Eliminar imagen (opcional)
router.delete('/:public_id', async (req, res) => {
    try {
        const publicId = req.params.public_id.replace(/--/g, '/');
        const result = await cloudinary.uploader.destroy(publicId);
        
        res.json({
            message: 'Imagen eliminada',
            result: result
        });
    } catch (error) {
        console.error('Error al eliminar imagen:', error);
        res.status(500).json({ error: 'Error al eliminar imagen' });
    }
});

module.exports = router;
