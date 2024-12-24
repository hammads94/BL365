import React from 'react';

const FloatingSocialIcons = () => {
    const socialLinks = [
        { icon: 'fab fa-telegram-plane', url: 'https://t.me/+9NDSNJoXI9RkNmMx', label: 'Follow us on Telegram' },
        { icon: 'fab fa-twitter', url: 'https://x.com/Life365Bal58289/', label: 'Follow us on Twitter' },
        { icon: 'fab fa-tiktok', url: 'https://www.tiktok.com/@aaronhassette?_t=8s2BWzFyLJd&_r=1', label: 'Follow us on TikTok' },
        { icon: 'fab fa-tiktok', url: 'https://www.tiktok.com/@balancedlife365?_t=8rw3u1pjhcl&_r=1', label: 'Follow us on TikTok' },
        { icon: 'fab fa-whatsapp', url: 'https://chat.whatsapp.com/LcbHevZBFQHFF2E4yk6k9J', label: 'Message us on WhatsApp' },
        { icon: 'fab fa-youtube', url: 'https://www.youtube.com/@balanced-Life365', label: 'Subscribe to our YouTube' },
        { icon: 'fab fa-discord', url: 'https://discord.gg/f8qR3wCd', label: 'Join us on Discord' },
    ];

    return (
        <div className="floating-icons">
            {socialLinks.map((link, index) => (
                <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
                    <i className={link.icon}></i>
                    <span>{link.label}</span>
                </a>
            ))}
        </div>
    );
};

export default FloatingSocialIcons;