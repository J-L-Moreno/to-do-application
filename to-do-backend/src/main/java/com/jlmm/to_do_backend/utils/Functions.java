package com.jlmm.to_do_backend.utils;

import java.util.concurrent.TimeUnit;

public class Functions {
	public static String milliecondsToMMSSFormat(long milliseconds) {		
		long MM = TimeUnit.MILLISECONDS.toMinutes(milliseconds);
		long SS = TimeUnit.MILLISECONDS.toSeconds(milliseconds) % 60;
		
		String MMSSFormat = String.format("%02d:%02d", MM, SS);
		
		return MMSSFormat;
	}
}
