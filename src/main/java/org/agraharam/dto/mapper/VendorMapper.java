package org.agraharam.dto.mapper;

import org.agraharam.dto.VendorDTO;
import org.agraharam.model.Vendor;

public final class VendorMapper {
    private VendorMapper() {}

    public static VendorDTO toDto(Vendor v) {
        return new VendorDTO(
                v.getId(), v.getName(), v.getContactName(), v.getPhone(),
                v.getEmail(), v.getAddress(), v.getCreatedAt(), v.getUpdatedAt()
        );
    }

    public static void applyUpdate(Vendor v, String name, String contactName, String phone, String email, String address) {
        v.setName(name);
        v.setContactName(contactName);
        v.setPhone(phone);
        v.setEmail(email);
        v.setAddress(address);
    }
}