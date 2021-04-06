module.exports = class ApiFeatures {
  constructor(mongoQuery, queryString) {
    this.mongoQuery = mongoQuery;
    this.queryString = queryString;
  }

  filter() {
    let query = { ...this.queryString };
    let excludedFields = ["sort", "page", "limit", "fields"];
    for (let key in query) {
      if (excludedFields.includes(key)) {
        delete query[key];
      }
    }
    //clean obj we have here now we need to add the functionality 'lt' 'lte' 'gte' 'gt' to the filter obj
    let filterString = JSON.stringify(query).replace(
      /\b(gte|gt|lt|lte)\b/g,
      (value) => `$${value}`
    ); //attach a '$' before those
    let filterObject = JSON.parse(filterString);

    this.mongoQuery.find(filterObject);
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      //here we sort based on that
      let sortString = this.queryString.sort.split(",").join(" ");
      this.mongoQuery.sort(sortString);
    } else {
      //we sort based on createdAt field
      this.mongoQuery.sort("-createdAt");
    }
    return this;
  }
  paginate() {
    if (this.queryString.page) {
      let page = this.queryString.page * 1;
      let limit = this.queryString.limit * 1;
      let skip = (page - 1) * limit;
      this.mongoQuery.skip(skip).limit(limit);
    } else {
      this.mongoQuery.skip(0).limit(9);
    }
    return this;
  }
};
