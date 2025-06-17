class BaseController {
    constructor(model) {
        this.model = model;
    }

    // Get all items
    getAll = async (req, res) => {
        try {
            const items = await this.model.find();
            res.json(items);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    // Get item by ID
    getById = async (req, res) => {
        try {
            const item = await this.model.findById(req.params.id);
            if (!item) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.json(item);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    // Create new item
    create = async (req, res) => {
        try {
            const item = new this.model(req.body);
            await item.save();
            res.status(201).json(item);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    // Update item
    update = async (req, res) => {
        try {
            const item = await this.model.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!item) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.json(item);
        } catch (err) {
            this.handleError(res, err);
        }
    };

    // Delete item
    delete = async (req, res) => {
        try {
            const item = await this.model.findByIdAndDelete(req.params.id);
            if (!item) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.json({ message: 'Item deleted successfully' });
        } catch (err) {
            this.handleError(res, err);
        }
    };

    // Error handler
    handleError = (res, err) => {
        console.error(err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation Error',
                errors: Object.values(err.errors).map(e => e.message)
            });
        }
        if (err.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        res.status(500).json({ message: 'Server Error' });
    };
}

module.exports = BaseController; 