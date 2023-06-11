
class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    regex() {
         // 0) Filtering on the basis of search term
         console.log(this.queryStr)
         if ((this.queryStr.searchTerms && this.queryStr.genderCategory) || this.queryStr.searchTerms) {
            this.query = this.query.find(
                {
                    name: {
                        $regex: `${this.queryStr.searchTerms}`,
                        $options: 'i'
                    }
                }
            );
        }
        return this;
    }

    filter() {

        // 1-A) Filtering
        let queryObject = {...this.queryStr};
        // execluding the fields which we want to calculate the data
        const excludedFields = ['searchTerms', 'sort', 'page', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObject[el]);

        // 1-B) Advance Filtering
        let queryString = JSON.stringify(queryObject);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        this.query = this.query.find(JSON.parse(queryString));

        return this;
    }

    sort() {
        // 2) Sorting
        if (this.queryStr.sort) {
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }
        return this;
    }

    limit() {
        // 3) Limiting
        if (this.queryStr.fields) {
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    paginate() {
        // 4) Pagination
        const page = this.queryStr.page * 1 || 1;
        const limit = this.queryStr.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = ApiFeatures;