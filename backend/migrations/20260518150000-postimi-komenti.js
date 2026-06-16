"use strict";

module.exports = {
  async up(queryInterface) {
    const postimiColumns = await queryInterface.describeTable("postimi");
    if (postimiColumns.autherName && !postimiColumns.authorName) {
      await queryInterface.renameColumn("postimi", "autherName", "authorName");
    }

    const komentiColumns = await queryInterface.describeTable("komenti");
    if (komentiColumns.Text && !komentiColumns.text) {
      await queryInterface.renameColumn("komenti", "Text", "text");
    }
  },

  async down(queryInterface) {
    const postimiColumns = await queryInterface.describeTable("postimi");
    if (postimiColumns.authorName && !postimiColumns.autherName) {
      await queryInterface.renameColumn("postimi", "authorName", "autherName");
    }

    const komentiColumns = await queryInterface.describeTable("komenti");
    if (komentiColumns.text && !komentiColumns.Text) {
      await queryInterface.renameColumn("komenti", "text", "Text");
    }
  },
};
