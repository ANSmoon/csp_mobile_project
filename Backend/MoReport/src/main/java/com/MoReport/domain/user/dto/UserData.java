package com.MoReport.domain.user.dto;

import com.MoReport.domain.user.domain.State;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserData {
    private int id;
    private String branchName;
    private String userName;
    private State state;
    private String phone;
    private String address;
    private LocalDate approvalDate;
    private LocalDate expirationDate;
}
