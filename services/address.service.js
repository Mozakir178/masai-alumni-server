const {ProfileModel } = require("../models/profile.model");
const { AddressModel } = require("../models/address.model");
const HttpException = require("../exceptions/HttpException");

const addressService = {
  createAddress: async (userId, addressData) => {
    try {
      let newAddress = await AddressModel.create({
        ...addressData,
        user_id: userId,
      });

      newAddress = await AddressModel.findByPk(newAddress.id);

      const addresses = await AddressModel.findAll({
        where: { user_id: userId },
      });

      if (addresses && addresses.length > 0) {
        const address = addresses.find(
          (e) => e.toJSON().type.toLowerCase() === "permanent"
        );

        if (address) {
          await ProfileModel.update(
            { city: address.dataValues.city },
            { where: { user_id: userId } }
          );
        } else {
          await ProfileModel.update(
            { city: null },
            { where: { user_id: userId } }
          );
        }
      } else {
        await ProfileModel.update(
          { city: null },
          { where: { user_id: userId } }
        );

        throw new HttpException(404, "Address record not found after creating");
      }

      return newAddress;
    } catch (error) {
      throw new HttpException(500, "Error creating address");
    }
  },

  updateAddress: async (userId, addressId, updatedAddressData) => {
    try {
      const address = await AddressModel.findOne({
        where: { id: addressId, user_id: userId },
      });

      if (address) {
        address.set(updatedAddressData);
        await address.save();

        const addresses = await AddressModel.findAll({
          where: { user_id: userId },
        });

        if (addresses && addresses.length > 0) {
          const address = addresses.find(
            (e) => e.toJSON().type.toLowerCase() === "permanent"
          );

          if (address) {
            await ProfileModel.update(
              { city: address.dataValues.city },
              { where: { user_id: userId } }
            );
          } else {
            await ProfileModel.update(
              { city: null },
              { where: { user_id: userId } }
            );
          }
        } else {
          await ProfileModel.update(
            { city: null },
            { where: { user_id: userId } }
          );

          throw new HttpException(
            404,
            "Address record not found after updating"
          );
        }

        return address;
      } else {
        return null;
      }
    } catch (error) {
      throw new HttpException(500, "Error updating address");
    }
  },

  deleteAddress: async (userId, addressId) => {
    try {
      const deletedRowsCount = await AddressModel.destroy({
        where: { id: addressId, user_id: userId },
      });

      const addresses = await AddressModel.findAll({
        where: { user_id: userId },
      });

      if (addresses && addresses.length > 0) {
        const address = addresses.find(
          (e) => e.toJSON().type.toLowerCase() === "permanent"
        );

        if (address) {
          await ProfileModel.update(
            { city: address.dataValues.city },
            { where: { user_id: userId } }
          );
        } else {
          await ProfileModel.update(
            { city: null },
            { where: { user_id: userId } }
          );
        }
      } else {
        await ProfileModel.update(
          { city: null },
          { where: { user_id: userId } }
        );
      }

      return deletedRowsCount;
    } catch (error) {
      throw new HttpException(500, "Error deleting address");
    }
  },
};

module.exports = { addressService };
