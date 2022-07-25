/**
* Class that represent the metadata of a specific implementation.
*/
class DefaultMetadata {
  /**
  * Default constructor.
  * @param {Object} metadata Metadata provide by leto-modelizer.
  */
  constructor(metadata) {
    /**
    * @type {Object}
    */
    this.metadata = metadata;
  }

  /**
  * Validate the provided metadata with a schemas.
  */
  validate() {
    return true;
  }
}

export default DefaultMetadata;
