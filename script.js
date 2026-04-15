document.addEventListener('DOMContentLoaded', () => {
    const ANNOUNCEMENT_FEEDBACK_MS = 2500;

    const views = {
        lab: document.getElementById('view-lab'),
        messages: document.getElementById('view-messages'),
        announcements: document.getElementById('view-announcements'),
        messageCompose: document.getElementById('view-compose'),
        announcementCompose: document.getElementById('view-announcement-compose'),
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
        setActiveView('messageCompose');
        setActiveNav('messages');
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

        if (messageRecipientInput) {
            messageRecipientInput.value = '';
        }
        if (messageBodyInput) {
            messageBodyInput.value = '';
        }
        updateMessageSendState();
        openMessages();
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

    renderAnnouncements();
    setActiveView('lab');
    setActiveNav('lab');
    setTopTab('messages');
    updateMessageSendState();
    updateAnnouncementRecipientState();
    updateAnnouncementPostState();
});
