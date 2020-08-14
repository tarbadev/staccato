exports.homeGet = async (req, res) => {
    const bundles = [
        { name: 'Bundle 1' },
        { name: 'Bundle 2' },
        { name: 'Bundle 3' },
    ]
    res.json(bundles)
}