package com.MoReport.global.common;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Builder
@Data
public class ResponseDto<T> {
	private final Boolean success;
	private final Integer code;
	private final String message;
	private final T data;
}
