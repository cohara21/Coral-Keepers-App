document.addEventListener('DOMContentLoaded', () => {
    const ANNOUNCEMENT_FEEDBACK_MS = 2500;

    const views = {
        lab: document.getElementById('view-lab'),
        messages: document.getElementById('view-messages'),
        announcements: document.getElementById('view-announcements'),
        messageCompose: document.getElementById('view-compose'),
        announcementCompose: document.getElementById('view-announcement-compose'),
        specialistChat: document.getElementById('view-specialist-chat'),
        account: document.getElementById('view-account'),
        accountProfile: document.getElementById('view-account-profile'),
    };

    const navItems = Array.from(document.querySelectorAll('.nav-item'));
    const navIcons = {
        lab: document.querySelector('[data-page="lab"] .nav-icon'),
        messages: document.querySelector('[data-page="messages"] .nav-icon'),
        account: document.querySelector('[data-page="account"] .nav-icon'),
    };
    const topTabButtons = Array.from(document.querySelectorAll('[data-view-target]'));

    const messageRecipientInput = document.getElementById('recipient-input');
    const messageBodyInput = document.getElementById('message-input');
    const messageSendButton = document.getElementById('send-button');
    const messageComposeBack = document.getElementById('compose-back');
    const messageLaunchCompose = document.querySelector('.message-list-card-action[data-course="intro"]');
    const sentToast = document.getElementById('sent-toast');
    const sentToastClose = document.getElementById('sent-toast-close');
    const sentToastTime = document.getElementById('sent-toast-time');

    const announcementFab = document.getElementById('announcement-fab');
    const announcementComposeBack = document.getElementById('announcement-compose-back');
    const announcementRecipientButtons = Array.from(document.querySelectorAll('.announcement-recipient'));
    const announcementSubjectInput = document.getElementById('announcement-subject');
    const announcementMessageInput = document.getElementById('announcement-message');
    const announcementPostButton = document.getElementById('announcement-post');
    const announcementToast = document.getElementById('announcement-toast');
    const announcementToastClose = document.getElementById('announcement-toast-close');
    const announcementToastTime = document.getElementById('announcement-toast-time');
    const viewProfileButton = document.getElementById('view-profile-button');
    const accountProfileBack = document.getElementById('account-profile-back');

    const specialistChatBack = document.getElementById('specialist-chat-back');
    const specialistChatTitle = document.getElementById('specialist-chat-title');
    const specialistThreadEl = document.getElementById('specialist-thread');
    const specialistChatInput = document.getElementById('specialist-chat-input');
    const specialistChatSend = document.getElementById('specialist-chat-send');
    const specialistCards = Array.from(document.querySelectorAll('.message-list-card-specialist[data-specialist]'));

    const specialistMeta = {
        courtenay: { title: 'Dr. Courtenay Kim' },
        john: { title: 'Diver John' },
    };

    const specialistThreads = {
        courtenay: [
            { from: 'them', text: 'Hi Rebecca — quick check on tank 3 before tomorrow\'s visit?', time: 'Mon 4:12 pm' },
            { from: 'me', text: 'All readings looked normal last night.', time: 'Mon 5:03 pm' },
            {
                from: 'them',
                text: 'How do you feel about the calcium dosing schedule we discussed? Want to bump it slightly before Friday\'s lab?',
                time: 'Tues 9:18 pm',
            },
        ],
        john: [
            { from: 'them', text: 'Hey, I can swing by with gear if you still need it.', time: 'Sun 11:02 am' },
            { from: 'me', text: 'Tuesday works best if that\'s okay.', time: 'Sun 2:41 pm' },
            {
                from: 'them',
                text: 'Sounds good! I can drop off the spare probes Tuesday morning before class.',
                time: 'Sun 3:05 pm',
            },
        ],
    };

    let activeSpecialistId = null;

    const announcementLists = {
        intro: document.getElementById('class-announcements-intro'),
        ecosystems: document.getElementById('class-announcements-ecosystems'),
        coral: document.getElementById('class-announcements-coral'),
    };

    const announcementClasses = [
        {
            id: 'intro',
            students: 28,
            announcements: [
                { subject: 'Substitute for next class!', meta: 'Sent Apr 12th - 28 Students' },
                { subject: 'Test Friday Cancelled', meta: 'Sent Apr 6th - 28 Students' },
            ],
        },
        {
            id: 'ecosystems',
            students: 30,
            announcements: [
                { subject: 'Team Salty Saviors please check tank fo...', meta: 'Sent Apr 9th - 30 Students' },
            ],
        },
        {
            id: 'coral',
            students: 23,
            announcements: [
                { subject: 'Filter cleaner will be absent, please som...', meta: 'Sent Apr 10th - 23 Students' },
            ],
        },
    ];

    const announcementState = {
        selectedClassId: null,
    };

    let announcementToastTimeout = null;
    let sentToastTimeout = null;

    function getAnnouncementClass(classId) {
        return announcementClasses.find((item) => item.id === classId) || null;
    }

    function setActiveView(target) {
        Object.values(views).forEach((view) => {
            if (view) {
                view.classList.remove('active');
            }
        });

        const targetView = views[target];
        if (targetView) {
            targetView.classList.add('active');
        }
    }

    function setActiveNav(target) {
        navItems.forEach((item) => item.classList.remove('active'));
        const targetItem = document.querySelector(`.nav-item[data-page="${target}"]`);
        if (targetItem) {
            targetItem.classList.add('active');
        }

        if (navIcons.lab) {
            navIcons.lab.src = target === 'lab' ? 'assets/icons/lab-items.png' : 'assets/icons/lab-items-inactive.png';
        }
        if (navIcons.messages) {
            navIcons.messages.src = target === 'messages' ? 'assets/icons/messages-active.svg' : 'assets/icons/messages.svg';
        }
        if (navIcons.account) {
            navIcons.account.src = target === 'account' ? 'assets/icons/account-active.svg' : 'assets/icons/account.svg';
        }
    }

    function setTopTab(target) {
        topTabButtons.forEach((button) => {
            button.classList.toggle('active', button.dataset.viewTarget === target);
        });
    }

    function hideAnnouncementToast() {
        if (!announcementToast) {
            return;
        }

        announcementToast.classList.remove('visible');
        if (announcementToastTimeout) {
            clearTimeout(announcementToastTimeout);
            announcementToastTimeout = null;
        }
    }

    function hideSentToast() {
        if (!sentToast) {
            return;
        }

        sentToast.classList.remove('visible');
        if (sentToastTimeout) {
            clearTimeout(sentToastTimeout);
            sentToastTimeout = null;
        }
    }

    function showAnnouncementToast(studentCount) {
        if (!announcementToast || !announcementToastTime) {
            return;
        }

        announcementToastTime.textContent = `${studentCount} Students Notified`;
        announcementToast.classList.add('visible');

        if (announcementToastTimeout) {
            clearTimeout(announcementToastTimeout);
        }

        announcementToastTimeout = setTimeout(() => {
            hideAnnouncementToast();
        }, ANNOUNCEMENT_FEEDBACK_MS);
    }

    function showSentToast(messageLabel) {
        if (!sentToast || !sentToastTime) {
            return;
        }

        sentToastTime.textContent = messageLabel;
        sentToast.classList.add('visible');

        if (sentToastTimeout) {
            clearTimeout(sentToastTimeout);
        }

        sentToastTimeout = setTimeout(() => {
            hideSentToast();
        }, ANNOUNCEMENT_FEEDBACK_MS);
    }

    function renderAnnouncements() {
        announcementClasses.forEach((classItem) => {
            const list = announcementLists[classItem.id];
            if (!list) {
                return;
            }

            list.innerHTML = '';

            classItem.announcements.forEach((announcement, index) => {
                const item = document.createElement('article');
                item.className = 'class-announcement';
                if (announcement.isNew && index === 0) {
                    item.classList.add('is-new');
                }

                const subject = document.createElement('p');
                subject.className = 'class-announcement-title';
                subject.textContent = announcement.subject;

                const meta = document.createElement('p');
                meta.className = 'class-announcement-meta';
                meta.textContent = announcement.meta;

                item.append(subject, meta);
                list.appendChild(item);
            });
        });
    }

    function updateMessageSendState() {
        if (!messageRecipientInput || !messageBodyInput || !messageSendButton) {
            return;
        }

        const hasText = messageRecipientInput.value.trim().length > 0 || messageBodyInput.value.trim().length > 0;
        messageSendButton.disabled = !hasText;
        messageSendButton.classList.toggle('active', hasText);
    }

    function updateAnnouncementRecipientState() {
        announcementRecipientButtons.forEach((button) => {
            const isSelected = button.dataset.classId === announcementState.selectedClassId;
            button.classList.toggle('is-selected', isSelected);
            button.setAttribute('aria-pressed', String(isSelected));
        });
    }

    function updateAnnouncementPostState() {
        if (!announcementSubjectInput || !announcementMessageInput || !announcementPostButton) {
            return;
        }

        const hasText = announcementSubjectInput.value.trim().length > 0
            && announcementMessageInput.value.trim().length > 0
            && Boolean(announcementState.selectedClassId);

        announcementPostButton.disabled = !hasText;
        announcementPostButton.classList.toggle('active', hasText);
    }

    function resetAnnouncementCompose() {
        announcementState.selectedClassId = null;
        if (announcementSubjectInput) {
            announcementSubjectInput.value = '';
        }
        if (announcementMessageInput) {
            announcementMessageInput.value = '';
        }
        updateAnnouncementRecipientState();
        updateAnnouncementPostState();
    }

    function openLab() {
        hideAnnouncementToast();
        hideSentToast();
        setActiveView('lab');
        setActiveNav('lab');
    }

    function openMessages() {
        hideAnnouncementToast();
        setActiveView('messages');
        setActiveNav('messages');
        setTopTab('messages');
    }

    function openAnnouncements() {
        setActiveView('announcements');
        setActiveNav('messages');
        setTopTab('announcements');
        renderAnnouncements();
    }

    function openMessageCompose() {
        hideAnnouncementToast();
        hideSentToast();
        setActiveView('messageCompose');
        setActiveNav('messages');
    }

    function formatDmTime(date) {
        return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    }

    function truncateDmPreview(text, maxLen = 72) {
        const cleaned = text.replace(/\s+/g, ' ').trim();
        if (cleaned.length <= maxLen) {
            return cleaned;
        }
        return `${cleaned.slice(0, Math.max(0, maxLen - 1))}…`;
    }

    function updateSpecialistComposerState() {
        if (!specialistChatInput || !specialistChatSend) {
            return;
        }
        const hasText = specialistChatInput.value.trim().length > 0;
        specialistChatSend.disabled = !hasText;
        specialistChatSend.classList.toggle('active', hasText);
    }

    function renderSpecialistThread() {
        if (!specialistThreadEl || !activeSpecialistId) {
            return;
        }
        const msgs = specialistThreads[activeSpecialistId];
        if (!msgs) {
            return;
        }

        specialistThreadEl.innerHTML = '';
        msgs.forEach((msg) => {
            const row = document.createElement('div');
            row.className = `dm-row dm-row--${msg.from}`;

            const bubble = document.createElement('div');
            bubble.className = `dm-bubble dm-bubble--${msg.from}`;

            const body = document.createElement('p');
            body.textContent = msg.text;

            const timeEl = document.createElement('span');
            timeEl.className = 'dm-time';
            timeEl.textContent = msg.time;

            bubble.append(body, timeEl);
            row.appendChild(bubble);
            specialistThreadEl.appendChild(row);
        });

        specialistThreadEl.scrollTop = specialistThreadEl.scrollHeight;
    }

    function updateSpecialistListPreview(specialistId, lastText) {
        const card = document.querySelector(`.message-list-card-specialist[data-specialist="${specialistId}"]`);
        if (!card) {
            return;
        }
        const preview = card.querySelector('.message-card-preview');
        const timeEl = card.querySelector('.message-card-time');
        if (preview) {
            preview.textContent = truncateDmPreview(lastText);
        }
        if (timeEl) {
            timeEl.textContent = formatDmTime(new Date());
        }
    }

    function openSpecialistChat(specialistId) {
        if (!specialistMeta[specialistId] || !views.specialistChat) {
            return;
        }
        hideAnnouncementToast();
        hideSentToast();
        activeSpecialistId = specialistId;
        if (specialistChatTitle) {
            specialistChatTitle.textContent = specialistMeta[specialistId].title;
        }
        renderSpecialistThread();
        if (specialistChatInput) {
            specialistChatInput.value = '';
        }
        updateSpecialistComposerState();
        setActiveView('specialistChat');
        setActiveNav('messages');
        setTopTab('messages');
        requestAnimationFrame(() => {
            specialistChatInput?.focus();
        });
    }

    function closeSpecialistChat() {
        activeSpecialistId = null;
        openMessages();
    }

    function sendSpecialistMessage() {
        if (!activeSpecialistId || !specialistChatSend || specialistChatSend.disabled) {
            return;
        }
        const text = specialistChatInput?.value.trim();
        if (!text) {
            return;
        }

        specialistThreads[activeSpecialistId].push({
            from: 'me',
            text,
            time: formatDmTime(new Date()),
        });

        if (specialistChatInput) {
            specialistChatInput.value = '';
        }
        updateSpecialistComposerState();
        renderSpecialistThread();
        updateSpecialistListPreview(activeSpecialistId, text);
    }

    function openAccount() {
        hideAnnouncementToast();
        setActiveView('account');
        setActiveNav('account');
    }

    function openAccountProfile() {
        hideAnnouncementToast();
        setActiveView('accountProfile');
        setActiveNav('account');
    }

    function openAnnouncementCompose() {
        hideAnnouncementToast();
        resetAnnouncementCompose();
        setActiveView('announcementCompose');
        setActiveNav('messages');
    }

    function sendMessage() {
        if (messageSendButton && messageSendButton.disabled) {
            return;
        }

        const recipientLabel = messageRecipientInput?.value.trim() || 'Intro to Biology';

        if (messageRecipientInput) {
            messageRecipientInput.value = '';
        }
        if (messageBodyInput) {
            messageBodyInput.value = '';
        }
        updateMessageSendState();
        openMessages();
        showSentToast(recipientLabel);
    }

    function postAnnouncement() {
        if (announcementPostButton && announcementPostButton.disabled) {
            return;
        }

        const classItem = getAnnouncementClass(announcementState.selectedClassId);
        if (!classItem || !announcementSubjectInput || !announcementMessageInput) {
            return;
        }

        const subject = announcementSubjectInput.value.trim();
        const message = announcementMessageInput.value.trim();

        const newAnnouncement = {
            subject,
            meta: `Sent Apr 13th - ${classItem.students} Students`,
            body: message,
            isNew: true,
        };

        classItem.announcements.unshift(newAnnouncement);

        openAnnouncements();
        showAnnouncementToast(classItem.students);

        setTimeout(() => {
            newAnnouncement.isNew = false;
            renderAnnouncements();
        }, ANNOUNCEMENT_FEEDBACK_MS);
    }

    navItems.forEach((item) => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const page = item.dataset.page;
            if (page === 'lab') {
                openLab();
            } else if (page === 'messages') {
                openMessages();
            } else if (page === 'account') {
                openAccount();
            }
        });
    });

    topTabButtons.forEach((button) => {
        button.addEventListener('click', () => {
            if (button.dataset.viewTarget === 'messages') {
                openMessages();
            } else if (button.dataset.viewTarget === 'announcements') {
                openAnnouncements();
            }
        });
    });

    if (messageLaunchCompose) {
        messageLaunchCompose.addEventListener('click', openMessageCompose);
    }
    if (messageComposeBack) {
        messageComposeBack.addEventListener('click', openMessages);
    }
    if (messageRecipientInput) {
        messageRecipientInput.addEventListener('input', updateMessageSendState);
    }
    if (messageBodyInput) {
        messageBodyInput.addEventListener('input', updateMessageSendState);
    }
    if (messageSendButton) {
        messageSendButton.addEventListener('click', sendMessage);
    }
    if (sentToastClose) {
        sentToastClose.addEventListener('click', hideSentToast);
    }

    if (announcementFab) {
        announcementFab.addEventListener('click', openAnnouncementCompose);
    }
    if (announcementComposeBack) {
        announcementComposeBack.addEventListener('click', openAnnouncements);
    }
    if (announcementToastClose) {
        announcementToastClose.addEventListener('click', hideAnnouncementToast);
    }
    announcementRecipientButtons.forEach((button) => {
        button.addEventListener('click', () => {
            announcementState.selectedClassId = button.dataset.classId;
            updateAnnouncementRecipientState();
            updateAnnouncementPostState();
        });
    });
    if (announcementSubjectInput) {
        announcementSubjectInput.addEventListener('input', updateAnnouncementPostState);
    }
    if (announcementMessageInput) {
        announcementMessageInput.addEventListener('input', updateAnnouncementPostState);
    }
    if (announcementPostButton) {
        announcementPostButton.addEventListener('click', postAnnouncement);
    }
    if (viewProfileButton) {
        viewProfileButton.addEventListener('click', openAccountProfile);
    }
    if (accountProfileBack) {
        accountProfileBack.addEventListener('click', openAccount);
    }

    if (specialistChatBack) {
        specialistChatBack.addEventListener('click', closeSpecialistChat);
    }
    if (specialistChatSend) {
        specialistChatSend.addEventListener('click', sendSpecialistMessage);
    }
    if (specialistChatInput) {
        specialistChatInput.addEventListener('input', updateSpecialistComposerState);
        specialistChatInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendSpecialistMessage();
            }
        });
    }

    specialistCards.forEach((card) => {
        const id = card.dataset.specialist;
        if (!id) {
            return;
        }
        card.addEventListener('click', () => openSpecialistChat(id));
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openSpecialistChat(id);
            }
        });
    });

    const LIVE_FEED_YOUTUBE_ID = 'eHxbMa2RVTQ';
    const liveFeedPlay = document.getElementById('live-feed-play');
    const liveFeedPoster = document.getElementById('live-feed-poster');
    const liveFeedEmbed = document.getElementById('live-feed-embed');
    const liveFeedIframeWrap = document.getElementById('live-feed-iframe-wrap');
    const liveFeedTapBack = document.getElementById('live-feed-tap-back');

    /** iOS (incl. Add to Home Screen) and most phones block unmuted embed autoplay — mute allows playback to start. */
    function liveFeedNeedsMutedAutoplay() {
        if (typeof navigator !== 'undefined' && navigator.standalone === true) {
            return true;
        }
        try {
            if (window.matchMedia('(display-mode: standalone)').matches) {
                return true;
            }
            if (window.matchMedia('(display-mode: fullscreen)').matches) {
                return true;
            }
            if (window.matchMedia('(pointer: coarse)').matches && window.matchMedia('(hover: none)').matches) {
                return true;
            }
        } catch {
            /* matchMedia unavailable */
        }
        const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
        if (/Android/i.test(ua)) {
            return true;
        }
        if (/iPhone|iPad|iPod/i.test(ua)) {
            return true;
        }
        if (
            typeof navigator !== 'undefined' &&
            navigator.platform === 'MacIntel' &&
            navigator.maxTouchPoints > 1
        ) {
            return true;
        }
        return false;
    }

    function liveFeedEmbedSrc(mutedAutoplay) {
        const params = new URLSearchParams({
            autoplay: '1',
            playsinline: '1',
            rel: '0',
            modestbranding: '1',
            iv_load_policy: '3',
            fs: '0',
            controls: mutedAutoplay ? '1' : '0',
        });
        if (mutedAutoplay) {
            params.set('mute', '1');
        }
        return `https://www.youtube.com/embed/${LIVE_FEED_YOUTUBE_ID}?${params.toString()}`;
    }

    function openLiveFeedYoutube() {
        if (!liveFeedEmbed || !liveFeedIframeWrap) {
            return;
        }

        liveFeedIframeWrap.innerHTML = '';

        const mutedAutoplay = liveFeedNeedsMutedAutoplay();

        const iframe = document.createElement('iframe');
        iframe.title = 'Live tank feed video';
        iframe.allow =
            'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        iframe.src = liveFeedEmbedSrc(mutedAutoplay);

        liveFeedIframeWrap.appendChild(iframe);
        liveFeedEmbed.hidden = false;
        if (liveFeedTapBack) {
            liveFeedTapBack.hidden = false;
            liveFeedTapBack.classList.toggle('live-feed-tap-back--chip', mutedAutoplay);
            liveFeedTapBack.classList.toggle('live-feed-tap-back--full', !mutedAutoplay);
            liveFeedTapBack.setAttribute(
                'aria-label',
                mutedAutoplay ? 'Close video' : 'Close video and return to preview'
            );
        }
        if (liveFeedPoster) {
            liveFeedPoster.hidden = true;
        }
    }

    function closeLiveFeedYoutube() {
        if (!liveFeedEmbed || !liveFeedIframeWrap) {
            return;
        }

        liveFeedIframeWrap.innerHTML = '';
        liveFeedEmbed.hidden = true;
        if (liveFeedTapBack) {
            liveFeedTapBack.hidden = true;
            liveFeedTapBack.classList.remove('live-feed-tap-back--chip', 'live-feed-tap-back--full');
        }
        if (liveFeedPoster) {
            liveFeedPoster.hidden = false;
        }
    }

    if (liveFeedPlay) {
        liveFeedPlay.addEventListener('click', openLiveFeedYoutube);
    }
    if (liveFeedTapBack) {
        liveFeedTapBack.addEventListener('click', closeLiveFeedYoutube);
    }

    // ===== LIVE TANK METRICS (SIMULATED, WEBSITE-PARITY) =====
    const labView = views.lab;

    const metricEls = (() => {
        if (!labView) {
            return null;
        }

        const healthMain = labView.querySelector('.health-percentage');
        const healthIcon = labView.querySelector('#health-cory-mascot');
        const healthScoreStatus = labView.querySelector('#health-score-status');
        const coreVitalsStatus = labView.querySelector('#core-vitals-status');
        const aiRecapText = labView.querySelector('#ai-recap-text');
        const healthDeltaText = labView.querySelector('.trend-value');
        const healthDeltaArrow = labView.querySelector('.trend-arrow');
        const timestamp = labView.querySelector('.timestamp');

        const vitalCards = Array.from(labView.querySelectorAll('.vital-card'));
        const findVitalCard = (title) => vitalCards.find((card) => {
            const label = card.querySelector('.vital-title');
            return Boolean(label && label.textContent && label.textContent.trim() === title);
        }) || null;

        const getCardParts = (card) => {
            if (!card) {
                return null;
            }

            return {
                value: card.querySelector('.vital-value'),
                changeValue: card.querySelector('.change-value'),
                changeArrow: card.querySelector('.change-arrow'),
            };
        };

        return {
            healthMain,
            healthIcon,
            healthScoreStatus,
            coreVitalsStatus,
            aiRecapText,
            healthDeltaText,
            healthDeltaArrow,
            timestamp,
            temp: getCardParts(findVitalCard('Temperature')),
            ph: getCardParts(findVitalCard('pH Level')),
            salinity: getCardParts(findVitalCard('Salinity')),
            redox: getCardParts(findVitalCard('Redox')),
        };
    })();

    const HEALTH_RANGE_NORMAL = [51, 100];
    /** Low demo mode: health stays within 0–50% and starts at 30 when enabled */
    const HEALTH_RANGE_LOW = [0, 50];
    const HEALTH_LOW_START = 30;
    /** When exiting low demo mode, restore this value (matches initial lab health). */
    const HEALTH_NORMAL_START = 85;

    const tankMetrics = {
        health: HEALTH_NORMAL_START,
        temp: 78.2,
        ph: 8.4,
        salinity: 35,
        redox: 380,
    };

    const tankBounds = {
        health: [...HEALTH_RANGE_NORMAL],
        temp: [72, 84],
        ph: [7.8, 8.8],
        salinity: [30, 40],
        redox: [300, 450],
    };

    /** Tap invisible hitbox on health card: low mode clamps 0–50% (starts at 30); tap again restores normal band and health to 85 */
    let tankLowHealthMode = false;

    function syncHealthBoundsToMode() {
        tankBounds.health = tankLowHealthMode ? [...HEALTH_RANGE_LOW] : [...HEALTH_RANGE_NORMAL];
    }

    function toggleTankLowHealthDemo() {
        tankLowHealthMode = !tankLowHealthMode;
        syncHealthBoundsToMode();
        if (tankLowHealthMode) {
            tankMetrics.health = HEALTH_LOW_START;
        } else {
            tankMetrics.health = HEALTH_NORMAL_START;
        }
        renderTankMetrics(lastTankDeltas);
    }

    const tankLowModeToggle = document.getElementById('tank-low-mode-toggle');
    if (tankLowModeToggle) {
        tankLowModeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleTankLowHealthDemo();
        });
    }

    let lastTankDeltas = { health: 0, temp: 0, ph: 0, salinity: 0, redox: 0 };

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    /** Same stops as #gaugeGradient in index.html — piecewise RGB lerp */
    const GAUGE_COLOR_STOPS = [
        { t: 0, r: 0xff, g: 0x5c, b: 0x69 },
        { t: 0.35, r: 0xff, g: 0xb0, b: 0x20 },
        { t: 0.65, r: 0xc7, g: 0xdd, b: 0x19 },
        { t: 1, r: 0x34, g: 0xc9, b: 0x6b },
    ];

    function lerpChannel(a, b, u) {
        return Math.round(a + (b - a) * u);
    }

    /** Cory 1 = happiest, Cory 6 = worst — filenames: Cory 1.svg … Cory 6.svg */
    const CORY_ALT_BY_TIER = [
        'Cory mascot, thriving',
        'Cory mascot, doing well',
        'Cory mascot, neutral',
        'Cory mascot, struggling',
        'Cory mascot, poor condition',
        'Cory mascot, critical condition',
    ];

    /** Indexed by Cory tier 1–6 (matches coryTierForHealth) */
    const HEALTH_SCORE_LABEL_BY_TIER = [
        'Optimal',
        'Strong',
        'Fair',
        'At risk',
        'Poor',
        'Critical',
    ];

    const CORE_VITALS_LABEL_BY_TIER = [
        'Perfect',
        'Steady',
        'Drifting',
        'Uneven',
        'Strained',
        'Failing',
    ];

    const AI_RECAP_BY_TIER = [
        'Tank chemistry is locked in: pH and calcium held steady through the last dosing cycle. Bio-filters are running clean and coral polyps look extended. Overall vitality is excellent—keep the current maintenance rhythm.',
        'Parameters look healthy overall: minor drift in alkalinity but within tolerance. Bio-filters are clearing waste steadily and coral tissue looks full. Watch nitrate on the next water change—nothing urgent yet.',
        'Readings are mixed: temperature and salinity are stable, but nutrient uptake has softened and corals look a little flat. Consider a modest water change and confirm dosing heads are firing on schedule.',
        'Several vitals are slipping together—buffering is weaker and bio-load looks uneven. Skimmer output dropped and algae may be gaining ground. Shorten the inspection interval and address filtration before scores fall further.',
        'The system is under stress: swings in pH or redox are stressing livestock and filtration is struggling to keep up. Partial water changes and reduced feeding are advised until metrics stabilize.',
        'Conditions are severe: core chemistry may be unsafe for sensitive species and biological filtration could crash without intervention. Treat this as an emergency review—test everything, reduce bio-load, and stabilize basics immediately.',
    ];

    /** Bands: ≥90 → 1, ≥75 → 2, ≥60 → 3, ≥45 → 4, ≥25 → 5, else → 6 */
    function coryTierForHealth(health) {
        const h = clamp(health, 0, 100);
        if (h >= 90) {
            return 1;
        }
        if (h >= 75) {
            return 2;
        }
        if (h >= 60) {
            return 3;
        }
        if (h >= 45) {
            return 4;
        }
        if (h >= 25) {
            return 5;
        }
        return 6;
    }

    function coryIllustrationSrc(tier) {
        return `assets/illustrations/${encodeURIComponent(`Cory ${tier}.svg`)}`;
    }

    function gaugeColorAtHealth(health) {
        const t = clamp(health, 0, 100) / 100;
        let i = 0;
        while (i < GAUGE_COLOR_STOPS.length - 1 && t > GAUGE_COLOR_STOPS[i + 1].t) {
            i += 1;
        }
        const a = GAUGE_COLOR_STOPS[i];
        const b = GAUGE_COLOR_STOPS[i + 1];
        const span = b.t - a.t;
        const u = span <= 0 ? 0 : (t - a.t) / span;
        const r = lerpChannel(a.r, b.r, u);
        const g = lerpChannel(a.g, b.g, u);
        const bl = lerpChannel(a.b, b.b, u);
        const toHex = (n) => n.toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
    }

    /* arc-knob-implementation.md — keep SVG path & constants in sync */
    const HEALTH_ARC_RADIUS_X = 114;
    const HEALTH_ARC_RADIUS_Y = 134;
    const HEALTH_ARC_CX = 130;
    const HEALTH_ARC_CY = 134;
    const HEALTH_KNOB_INDICATOR_OFFSET = 2.5;
    /** Horizontal trim — scaled by cos(angle) so low-health (left of arc) isn’t pushed right like a constant +5px does */
    const HEALTH_KNOB_SHIFT_X = 5;

    function updateHealthMeterKnob(value) {
        const knobGroup = labView?.querySelector('#knobGroup');
        if (!knobGroup) {
            return;
        }

        const clamped = clamp(value, 0, 100);
        const percentage = clamped / 100;
        const angleRad = Math.PI - percentage * Math.PI;
        const x = HEALTH_ARC_CX + HEALTH_ARC_RADIUS_X * Math.cos(angleRad);
        const y = HEALTH_ARC_CY - HEALTH_ARC_RADIUS_Y * Math.sin(angleRad);
        const dx = -HEALTH_ARC_RADIUS_X * Math.sin(angleRad);
        const dy = -HEALTH_ARC_RADIUS_Y * Math.cos(angleRad);
        const rotation = (Math.atan2(dy, dx) * 180) / Math.PI;
        const normalX = (x - HEALTH_ARC_CX) / (HEALTH_ARC_RADIUS_X * HEALTH_ARC_RADIUS_X);
        const normalY = (y - HEALTH_ARC_CY) / (HEALTH_ARC_RADIUS_Y * HEALTH_ARC_RADIUS_Y);
        const normalLength = Math.hypot(normalX, normalY) || 1;
        const offsetX = (normalX / normalLength) * HEALTH_KNOB_INDICATOR_OFFSET;
        const offsetY = (normalY / normalLength) * HEALTH_KNOB_INDICATOR_OFFSET;
        const knobShiftX = HEALTH_KNOB_SHIFT_X * Math.cos(angleRad);

        knobGroup.setAttribute(
            'transform',
            `translate(${x + offsetX + knobShiftX}, ${y + offsetY}) rotate(${rotation})`
        );
    }

    function jitterByPercent(value) {
        const pct = (Math.random() * 4) - 2;
        return { value: value * (1 + pct / 100), pct };
    }

    function arrowGlyphForPct(changePct) {
        if (changePct > 0.05) {
            return '↑';
        }
        if (changePct < -0.05) {
            return '↓';
        }
        return '→';
    }

    function formatClockTime(date) {
        const hours24 = date.getHours();
        const hours12 = hours24 % 12 || 12;
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        const pad2 = (n) => String(n).padStart(2, '0');
        return `${pad2(hours12)}:${pad2(minutes)}:${pad2(seconds)}`;
    }

    function renderTankMetrics(deltas) {
        if (!metricEls) {
            return;
        }

        lastTankDeltas = deltas;

        if (metricEls.healthMain) {
            metricEls.healthMain.textContent = `${Math.round(tankMetrics.health)}%`;
        }
        if (metricEls.healthDeltaText) {
            metricEls.healthDeltaText.textContent = `${Math.abs(deltas.health).toFixed(1)}%`;
        }
        if (metricEls.healthDeltaArrow) {
            metricEls.healthDeltaArrow.textContent = arrowGlyphForPct(deltas.health);
        }

        if (metricEls.temp?.value) {
            metricEls.temp.value.textContent = `${tankMetrics.temp.toFixed(1)}°F`;
        }
        if (metricEls.ph?.value) {
            metricEls.ph.value.textContent = tankMetrics.ph.toFixed(2);
        }
        if (metricEls.salinity?.value) {
            metricEls.salinity.value.textContent = `${Math.round(tankMetrics.salinity)} ppt`;
        }
        if (metricEls.redox?.value) {
            metricEls.redox.value.textContent = `${Math.round(tankMetrics.redox)} mV`;
        }

        if (metricEls.temp?.changeValue) {
            metricEls.temp.changeValue.textContent = `${Math.abs(deltas.temp).toFixed(1)}°`;
        }
        if (metricEls.temp?.changeArrow) {
            metricEls.temp.changeArrow.textContent = arrowGlyphForPct(deltas.temp);
        }

        if (metricEls.ph?.changeArrow) {
            metricEls.ph.changeArrow.textContent = arrowGlyphForPct(deltas.ph);
        }

        if (metricEls.salinity?.changeValue) {
            metricEls.salinity.changeValue.textContent = `${Math.abs(deltas.salinity).toFixed(1)} ppt`;
        }
        if (metricEls.salinity?.changeArrow) {
            metricEls.salinity.changeArrow.textContent = arrowGlyphForPct(deltas.salinity);
        }

        if (metricEls.redox?.changeArrow) {
            metricEls.redox.changeArrow.textContent = arrowGlyphForPct(deltas.redox);
        }

        const healthHue = gaugeColorAtHealth(tankMetrics.health);
        if (metricEls.healthMain) {
            metricEls.healthMain.style.color = healthHue;
        }
        if (metricEls.healthScoreStatus) {
            metricEls.healthScoreStatus.style.color = healthHue;
        }
        if (metricEls.coreVitalsStatus) {
            metricEls.coreVitalsStatus.style.color = healthHue;
        }

        const coryTier = coryTierForHealth(tankMetrics.health);
        const tierIdx = coryTier - 1;
        if (metricEls.healthScoreStatus) {
            metricEls.healthScoreStatus.textContent = HEALTH_SCORE_LABEL_BY_TIER[tierIdx] || '—';
        }
        if (metricEls.coreVitalsStatus) {
            metricEls.coreVitalsStatus.textContent = CORE_VITALS_LABEL_BY_TIER[tierIdx] || '—';
        }
        if (metricEls.aiRecapText) {
            metricEls.aiRecapText.textContent = AI_RECAP_BY_TIER[tierIdx] || '';
        }

        if (metricEls.healthIcon) {
            const prevTier = metricEls.healthIcon.dataset.coryTier;
            if (prevTier !== String(coryTier)) {
                metricEls.healthIcon.dataset.coryTier = String(coryTier);
                metricEls.healthIcon.src = coryIllustrationSrc(coryTier);
                metricEls.healthIcon.alt = CORY_ALT_BY_TIER[coryTier - 1] || 'Cory mascot';
            }
        }

        updateHealthMeterKnob(tankMetrics.health);
    }

    function updateLabTimestamp() {
        if (!metricEls?.timestamp) {
            return;
        }

        metricEls.timestamp.textContent = formatClockTime(new Date());
    }

    function runTankTick() {
        const healthUpdate = jitterByPercent(tankMetrics.health);
        tankMetrics.health = clamp(healthUpdate.value, tankBounds.health[0], tankBounds.health[1]);

        const tempUpdate = jitterByPercent(tankMetrics.temp);
        tankMetrics.temp = clamp(tempUpdate.value, tankBounds.temp[0], tankBounds.temp[1]);

        const phUpdate = jitterByPercent(tankMetrics.ph);
        tankMetrics.ph = clamp(phUpdate.value, tankBounds.ph[0], tankBounds.ph[1]);

        const salinityUpdate = jitterByPercent(tankMetrics.salinity);
        tankMetrics.salinity = clamp(salinityUpdate.value, tankBounds.salinity[0], tankBounds.salinity[1]);

        const redoxUpdate = jitterByPercent(tankMetrics.redox);
        tankMetrics.redox = clamp(redoxUpdate.value, tankBounds.redox[0], tankBounds.redox[1]);

        renderTankMetrics({
            health: healthUpdate.pct,
            temp: tempUpdate.pct,
            ph: phUpdate.pct,
            salinity: salinityUpdate.pct,
            redox: redoxUpdate.pct,
        });

        setTimeout(runTankTick, 6000 + (Math.random() * 1000));
    }

    // Initial render (zero deltas), then start ticking.
    renderTankMetrics(lastTankDeltas);
    updateLabTimestamp();
    setTimeout(runTankTick, 6000 + (Math.random() * 1000));
    setInterval(updateLabTimestamp, 1000);

    renderAnnouncements();
    setActiveView('lab');
    setActiveNav('lab');
    setTopTab('messages');
    updateMessageSendState();
    updateAnnouncementRecipientState();
    updateAnnouncementPostState();
});
