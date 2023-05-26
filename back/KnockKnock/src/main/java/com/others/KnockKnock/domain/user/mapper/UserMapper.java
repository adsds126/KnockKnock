package com.others.KnockKnock.domain.user.mapper;

import com.others.KnockKnock.domain.user.dto.UserDto;
import com.others.KnockKnock.domain.user.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserMapper {
    User userDtoSignupToUser(UserDto.Signup requestBody);
    User userDtoLoginToUser(UserDto.Login requestBody);
    UserDto.Response userToResponse(User user);
}
