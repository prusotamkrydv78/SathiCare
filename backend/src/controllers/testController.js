// Test controller
export const getTest = (req, res) => {
    res.json({
        message: 'Test controller working',
        data: { test: true }
    });
};

export const postTest = (req, res) => {
    res.json({
        message: 'POST request received',
        receivedData: req.body
    });
};
