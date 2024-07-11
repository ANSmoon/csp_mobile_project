package com.MoReport.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MokiLoginResponseDto {
	private String result;
	private String msg;
	private String mb_id;
	private String mb_name;
	private String mb_hp;
	private String mb_email;
	private String mb_addr;
	private String waiting_use;
	private String pos_use;
	private String mb_kiosk_type;
	private String banner_imae;
	private String mb_newop;
}
