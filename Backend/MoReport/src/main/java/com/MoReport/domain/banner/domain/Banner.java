package com.MoReport.domain.banner.domain;

import com.MoReport.domain.image.Image;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Table;

@Entity
@Getter
@Setter
@Table(name = "Banner")
public class Banner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn (name = "image_id", nullable = false)
    private Image image;

    @Column (name = "banner_name", nullable = false, unique = true)
    private String bannerName;

    @Column(name = "state")
    @Enumerated(EnumType.STRING)
    private BannerState state;

}
