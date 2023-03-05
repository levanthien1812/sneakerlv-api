class ReadFeatures {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }

    filter() {
        let queryObj = { ...this.queryString }
        const excludedFields = ['page', 'fields', 'sort', 'limit', 'search']
        excludedFields.forEach(e => delete queryObj[e]);

        let queryObjStr = JSON.stringify(queryObj)
        queryObjStr = queryObjStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        queryObj = JSON.parse(queryObjStr)

        this.query = this.query.find(queryObj)
        return this
    }

    sort() {
        if (this.queryString.sort) {
            let sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }
        return this
    }

    paginate() {
        // * 1 to convert string to integer
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 20
        const skip = (page - 1) * limit
        
        this.query = this.query.skip(skip).limit(limit)
        return this
    }
}

module.exports = ReadFeatures