package com.MoReport.global.mail;

import com.MoReport.domain.user.dao.UserRepository;
import com.MoReport.domain.user.domain.State;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import java.io.UnsupportedEncodingException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import lombok.RequiredArgsConstructor;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MailService {
    private final JavaMailSender mailSender;
    private final UserRepository userRepository;

    @Scheduled(cron = "0 15 22 * * ?", zone = "Asia/Seoul")  // 매일 22시 15분에 실행, 서울 기준
    public void sendEmailToUsersWithUsingState() {
        List<String> emailsWhoPermitted = userRepository.findEmailsByState(State.PERMITTED);

        LocalDate currentDate = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String formattedDate = currentDate.format(formatter);

        String subject = formattedDate + "일자 보고서 알림 메일입니다.";
        String text = "안녕하세요 Moki 키오스크를 이용해주셔서 감사합니다.\n" +
                "예상 매출액과 오늘의 매출을 갱신한 " + formattedDate + "일자 보고서가 작성되었습니다!\n" +
                "보고서는 아래 링크를 통해 확인하실 수 있습니다.\n" +
                "https://cspsummerproject.netlify.app/login\n\n" +
                "항상 좋은 하루 되세요. 감사합니다.";


        //Mail 일괄 전송
        for (String email : emailsWhoPermitted) {
            sendSimpleMessage(email, subject, text);
        }
    }

    private void sendSimpleMessage(String to, String subject, String text) {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message);

        try {
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text);
            helper.setFrom(new InternetAddress("fanta4715@naver.com","moki"));

            mailSender.send(message);
            log.info("이메일이 전송되었습니다!");
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.info("이메일 전송 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}
