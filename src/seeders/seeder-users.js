'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'admin@gmail.com',
      password:'123456',
      firstName: 'Nguyen',
      lastName: 'Trong',
      address: 'TPHCM',
      gender: 1,
      roleId: 'R1',
      phonenumber: '0123456',
      positionId: 'Doctor',
      image: 'aaa',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:vidunhuvay
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
