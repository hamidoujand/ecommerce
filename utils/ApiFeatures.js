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
};
