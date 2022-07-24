const db = {
    connectionString: `mongodb://${process.env.DB_HOST}/${process.env.DB_DATABASE}`
}

module.exports = {
    db,
};