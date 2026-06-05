/*
   BosPros Group Presentation - Interaction Logic & State Management
   Implements Navigation and Interactive SVG Diagram Controllers (Turkish Only)
*/

document.addEventListener("DOMContentLoaded", () => {
    // STATE
    const state = {
        currentSlide: 1,
        totalSlides: 26,
        autoplay: false,
        autoplayTimer: null,
        autoplayInterval: 8000, // 8 seconds per slide
        sidebarOpen: true
    };

    // DOM ELEMENTS
    const elements = {
        appContainer: document.getElementById("app-container"),
        sidebar: document.getElementById("sidebar"),
        toggleSidebarBtn: document.getElementById("toggle-sidebar-btn"),
        closeSidebarBtn: document.getElementById("close-sidebar-btn"),
        sidebarMenu: document.getElementById("sidebar-menu"),
        fullscreenBtn: document.getElementById("fullscreen-btn"),
        autoplayBtn: document.getElementById("autoplay-btn"),
        printBtn: document.getElementById("print-btn"),
        prevSlideBtn: document.getElementById("prev-slide-btn"),
        nextSlideBtn: document.getElementById("next-slide-btn"),
        slideCounter: document.getElementById("slide-counter"),
        slides: document.querySelectorAll(".slide"),
        playIcon: document.getElementById("play-icon"),
        pauseIcon: document.getElementById("pause-icon")
    };

    // SLIDES METADATA (For Sidebar Menu)
    const slidesData = [
        { id: 1, name: "Kapak" },
        { id: 2, name: "BosPros'a Genel Bakış" },
        { id: 3, name: "BosPros Hikâyesi" },
        { id: 4, name: "BosPros Nedir?" },
        { id: 5, name: "Misyon & Vizyon" },
        { id: 6, name: "Neden BosPros?" },
        { id: 7, name: "Küresel Ekosistem" },
        { id: 8, name: "Grup Mimarisi" },
        { id: 9, name: "Büyüme Bölümü" },
        { id: 10, name: "GLOB 360° Süreci" },
        { id: 11, name: "GLOB Hizmet Katmanları" },
        { id: 12, name: "GlobHer" },
        { id: 13, name: "CUBE Saha Operasyonu" },
        { id: 14, name: "Pumion (Teknoloji)" },
        { id: 15, name: "Kreatif Bölüm (GGL)" },
        { id: 16, name: "GGL Works Akışı" },
        { id: 17, name: "BosPros Akademi" },
        { id: 18, name: "BosPros Kulübü" },
        { id: 19, name: "BosPros İstihbaratı" },
        { id: 20, name: "Küresel Partner Ağı" },
        { id: 21, name: "Müşteri Yolculuğu" },
        { id: 22, name: "Büyüme Volanı" },
        { id: 23, name: "Globalleşme Hedefi" },
        { id: 24, name: "2030 Vizyonu" },
        { id: 25, name: "Uzun Vadeli Değer" },
        { id: 26, name: "Kapanış" }
    ];

    // ECOSYSTEM INTERACTIVE DATA
    const ecosystemData = {
        glob: {
            title: "GLOB by BosPros",
            desc: "360° Küresel Büyüme Sistemi. Firmalara masa başı analizlerden saha doğrulamasına, yurt dışı şirketleşmeden ekip eğitimlerine kadar uçtan uca yol arkadaşlığı sunan BosPros'un ana büyüme motorudur.",
            items: ["Hedef Pazar Analizi", "Saha Doğrulaması", "Rakip & Rekabet Analizi", "Filtrelenmiş Alıcı Listeleri", "Tedarikçi Raporu", "Yurt Dışı Yapılanma", "İhracat Teşvikleri", "Ekip Mentorluğu"],
            logo: "logos/glob.png"
        },
        globher: {
            title: "GlobHer by BosPros",
            desc: "Kadın odaklı küresel büyüme programı. Kadın girişimcileri ve kadın ortaklı firmaları uluslararası pazarlara taşır. Ticari büyümeyi toplumsal fayda sağlayan bir sosyal etki modeliyle birleştirir.",
            items: ["İvme Bireysel E-Ticaret Planı", "Zirve Kurumsal İhracat Planı", "Sosyal Etki Eşitlik Programı", "Etsy, Amazon & Ozon Kurulumu", "ABD Şirket & Banka Entegrasyonu", "Haftalık Birebir Gelişim Mentorluğu"],
            logo: "logos/globher.png"
        },
        cube: {
            title: "Cube by BosPros",
            desc: "Saha Uygulama Operasyonu. Stratejik pazar planlarını sahaya indirir. BosPros müşterileri adına yurt dışında distribütör kuran, bayi görüşmelerini yürüten ve fiziki satışı kapatan saha uygulama markasıdır.",
            items: ["Distribütör Ağı Yapılanması", "Fiziki Alıcı Ziyaretleri", "Sıcak Satış Görüşmeleri", "Pazarlık Desteği", "Servis & Memnuniyet Ağı Kurulumu", "Saha Denetimi"],
            logo: "logos/cube.png"
        },
        pumion: {
            title: "Pumion by BosPros",
            desc: "Ekosistem Teknoloji Motoru. BosPros ekosisteminin bulut yazılım, yapay zekâ ve otonom yazılım gücüdür. Ticari operasyonları hızlandıran otonom yapay zekâ yazılımları ve bulut tabanlı uygulamalar geliştirir.",
            items: ["Bulut Yazılım Ürünleri", "Otonom Yapay Zekâ İş Akışları", "Web, Mobil & Yönetim Paneli Geliştirme", "Entegrasyon & Müşteri Yönetim Sistemleri", "Şirket İçi Yapay Zekâ Dönüşüm Çözümleri", "Veri İşleme Algoritmaları"],
            logo: "logos/pumion.png"
        },
        ggl: {
            title: "GGL Studio & GGL Works",
            desc: "Kreatif Bölüm. Şirketlerin küresel markalamalarını kuran kreatif katmandır. GGL Works ise abonelik modeliyle ajans kalitesinde grafik tasarımları 24 saat içinde teslim eden abonelik tabanlı kreatif tasarım markasıdır.",
            items: ["GGL Studio Kurumsal Kimlik", "Web Site & Arayüz Tasarımları", "İhracata Uygun Pazarlama Altyapısı", "GGL Works Abonelik Tasarım Servisi", "24 Saatte Hızlı Teslim", "Form Üzerinden Talep Yönetimi"],
            logo: "logos/ggl_studio.png"
        },
        academy: {
            title: "BosPros Akademi",
            desc: "Eğitim & Yetkinlik Motoru. Rapor ve stratejilerin şirketlerin kendi ekipleri tarafından uygulanabilir kılınması için çalışır. Amaç, firmayı danışmana bağımlı olmaktan çıkarıp iç yetkinliğini kurmaktır.",
            items: ["Temel İhracat Akademisi", "Yapay Zekâ Akademisi", "Dijital Büyüme Akademisi (E-İhracat ve Reklam)", "Kurumsal Akademi (Kurumsal Eğitim)", "Pratik Atölyeler & Mentorluk", "Ekip Yetkinlik Sertifikasyonu"],
            logo: "logos/academy.png"
        },
        club: {
            title: "BosPros Kulübü",
            desc: "Ekosistem Omurgası. Stratejik Büyüme Girişimi. Müşterileri, küresel ortakları, distribütörleri, mentorları ve yatırımcıları tek bir ağda buluşturan topluluk ve sürekli iş geliştirme katmanıdır.",
            items: ["Müşteri Ağı", "Küresel Partner Ofisleri Bağlantısı", "Distribütör & Bayi Veritabanı", "Melek Yatırımcı & Girişim Sermayesi Buluşmaları", "Uzman Mentor Desteği", "Sürekli Sinerji & Çapraz Satış"],
            logo: "logos/club.png"
        },
        intelligence: {
            title: "BosPros İstihbaratı",
            desc: "Veri Sermayesi. Stratejik Büyüme Girişimi. Her GLOB projesi ve CUBE saha operasyonunda derlenen rakip fiyatlama, onaylı bayi, gümrük ve saha verilerinin ticari veri ürünlerine dönüştürülmesini hedefler.",
            items: ["Canlı Saha Pazar İstihbaratı", "Gümrük & Ticaret Veri Ürünleri", "Distribütör & Tedarikçi Değerlemesi", "Yapay Zekâ Karar Destek Algoritmaları", "Veriye Dayalı Pazar Analiz Deposu", "Küresel Ticari İstihbarat Platformu"],
            logo: "logos/intelligence.png"
        }
    };

    // PARTNER NETWORK DATA
    const partnerData = {
        "tr-us": "Türkiye (Genel Merkez ve Ana Operasyon Akışı) & Amerika Birleşik Devletleri (Global Yapılanma ve E-Ticaret Lojistik Aksı)",
        "eu": "Birleşik Krallık, Almanya, Hollanda, İtalya, İspanya, Portekiz, Bulgaristan (Avrupa Birliği Distribütörlük ve Şirketleşme Ağı)",
        "apac": "Bangladeş, Pakistan, Hindistan, Tayland, Vietnam, Malezya, Endonezya (Asya Pasifik Canlı Pazar İstihbaratı ve Üretici Ağı)"
    };

    // CUSTOMER JOURNEY PIPELINE DATA
    const journeyData = {
        1: {
            title: "1. GLOB - Pazar Seçimi & Strateji",
            desc: "Müşteri sisteme girdiğinde gümrük verileri, pazar potansiyeli ve saha doğrulamasıyla hedef pazar planı çizilir. Hangi ülkelere, hangi kanallardan ve hangi fiyatlarla girileceği belirlenir."
        },
        2: {
            title: "2. BosPros Akademi - Ekip Yetkinliği",
            desc: "GLOB raporundaki stratejilerin başarıyla yürütülmesi için müşteri firmanın kendi personeline uygulamalı ihracat, yapay zekâ verimliliği ve dijital büyüme eğitimleri verilerek yetkinlik kurulur."
        },
        3: {
            title: "3. GGL Studio - Marka & Dijital Altyapı",
            desc: "Global pazarda güvenilirlik sağlamak için web siteleri, kurumsal kimlik, kataloglar ve ihracata uyumlu reklam altyapıları kurulur veya revize edilir. GGL Works aylık görsel ihtiyaçlarını giderir."
        },
        4: {
            title: "4. Pumion - Teknoloji & Yapay Zekâ",
            desc: "Firmaya özel CRM sistemleri kurulur, otomasyon araçları entegre edilir ve operasyonların insan gücünden bağımsız şekilde ölçeklenmesini sağlayacak yazılım ve yapay zekâ temsilcisi kurguları yapılır."
        },
        5: {
            title: "5. CUBE - Saha Uygulama & Satış",
            desc: "Stratejiler ve altyapı hazırlandıktan sonra CUBE ekibi fiziki pazar ziyaretleri gerçekleştirir, distribütör adayları ile görüşür, pazarlıkları yönetir ve ilk satışları kapatarak sistemi kurar."
        },
        6: {
            title: "6. BosPros Kulübü - Topluluk & Süreklilik",
            desc: "Satış kanalları oturtulan firma ekosistem topluluğuna katılır. Diğer üyelerle çapraz satış yapar, global partnerlerin getirdiği yeni ticari fırsatları değerlendirir ve ömür boyu değer alır."
        }
    };

    // INITIALIZATION FUNCTION
    function init() {
        renderSidebarMenu();
        setupEventListeners();
        updateUI();
        initInteractiveModules();
    }

    // RENDER SIDEBAR LIST
    function renderSidebarMenu() {
        elements.sidebarMenu.innerHTML = "";
        slidesData.forEach(slide => {
            const li = document.createElement("li");
            li.dataset.slideId = slide.id;
            
            const numSpan = document.createElement("span");
            numSpan.className = "menu-num";
            numSpan.textContent = String(slide.id).padStart(2, '0');
            
            const nameSpan = document.createElement("span");
            nameSpan.className = "menu-name";
            nameSpan.textContent = slide.name;
            
            li.appendChild(numSpan);
            li.appendChild(nameSpan);
            
            li.addEventListener("click", () => {
                goToSlide(slide.id);
                // Close sidebar on mobile after clicking
                if (window.innerWidth <= 1024) {
                    toggleSidebar(false);
                }
            });
            
            elements.sidebarMenu.appendChild(li);
        });
    }

    // SETUP EVENT LISTENERS
    function setupEventListeners() {
        // Sidebar toggle button (hamburger)
        elements.toggleSidebarBtn.addEventListener("click", () => {
            toggleSidebar(!state.sidebarOpen);
        });

        // Close sidebar btn (mobile)
        elements.closeSidebarBtn.addEventListener("click", () => {
            toggleSidebar(false);
        });

        // Prev & Next Buttons
        elements.prevSlideBtn.addEventListener("click", prevSlide);
        elements.nextSlideBtn.addEventListener("click", nextSlide);

        // Fullscreen Mode
        elements.fullscreenBtn.addEventListener("click", toggleFullscreen);

        // Autoplay Mode
        elements.autoplayBtn.addEventListener("click", toggleAutoplay);

        // Print to PDF (Print)
        elements.printBtn.addEventListener("click", () => {
            window.print();
        });

        // Keyboard listeners for presentation controls
        document.addEventListener("keydown", handleKeyDown);

        // Throttled Scroll Wheel presentation navigation
        let lastScrollTime = 0;
        const scrollThrottle = 1000; // 1 second cooldown
        document.addEventListener("wheel", (e) => {
            // Only scroll slides if not inside a scrollable card elements
            const activeSlideEl = document.querySelector(".slide.active-slide");
            if (activeSlideEl && activeSlideEl.scrollHeight > activeSlideEl.clientHeight) {
                // If the slide itself is long and scrollable, let the native scroll work first
                const isScrollingDown = e.deltaY > 0;
                const isAtBottom = Math.abs(activeSlideEl.scrollHeight - activeSlideEl.clientHeight - activeSlideEl.scrollTop) < 2;
                const isAtTop = activeSlideEl.scrollTop === 0;

                if (isScrollingDown && !isAtBottom) return;
                if (!isScrollingDown && !isAtTop) return;
            }

            const now = Date.now();
            if (now - lastScrollTime < scrollThrottle) return;

            if (e.deltaY > 30) {
                nextSlide();
                lastScrollTime = now;
            } else if (e.deltaY < -30) {
                prevSlide();
                lastScrollTime = now;
            }
        });
    }

    // FULLSCREEN HANDLER
    function toggleFullscreen() {
        const docEl = document.documentElement;
        
        if (!document.fullscreenElement) {
            docEl.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
            elements.appContainer.classList.add("fullscreen-active");
        } else {
            document.exitFullscreen();
            elements.appContainer.classList.remove("fullscreen-active");
        }
    }

    // Monitor escape or native fullscreen close
    document.addEventListener("fullscreenchange", () => {
        if (!document.fullscreenElement) {
            elements.appContainer.classList.remove("fullscreen-active");
        }
    });

    // KEYBOARD EVENT LISTENER
    function handleKeyDown(e) {
        if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;

        switch (e.key) {
            case "ArrowRight":
            case "Space":
            case "PageDown":
                e.preventDefault();
                nextSlide();
                break;
            case "ArrowLeft":
            case "PageUp":
                e.preventDefault();
                prevSlide();
                break;
            case "Home":
                e.preventDefault();
                goToSlide(1);
                break;
            case "End":
                e.preventDefault();
                goToSlide(state.totalSlides);
                break;
            case "f":
            case "F":
                toggleFullscreen();
                break;
        }
    }

    // NAVIGATION CONTROLLERS
    function nextSlide() {
        if (state.currentSlide < state.totalSlides) {
            goToSlide(state.currentSlide + 1);
        } else {
            goToSlide(1);
        }
        resetAutoplayTimer();
    }

    function prevSlide() {
        if (state.currentSlide > 1) {
            goToSlide(state.currentSlide - 1);
        } else {
            goToSlide(state.totalSlides);
        }
        resetAutoplayTimer();
    }

    function goToSlide(id) {
        if (id < 1 || id > state.totalSlides) return;
        
        document.querySelector(".slide.active-slide")?.classList.remove("active-slide");
        
        const newSlide = document.getElementById(`slide-${id}`);
        if (newSlide) {
            newSlide.classList.add("active-slide");
            state.currentSlide = id;
        }
        
        window.location.hash = `slide-${id}`;
        if (newSlide) newSlide.scrollTop = 0;

        updateUI();
    }

    // UPDATE UI PARTS
    function updateUI() {
        elements.slideCounter.textContent = `${state.currentSlide} / ${state.totalSlides}`;
        
        document.querySelector(".slide-list li.active-menu-item")?.classList.remove("active-menu-item");
        const activeMenuItem = document.querySelector(`.slide-list li[data-slide-id="${state.currentSlide}"]`);
        if (activeMenuItem) {
            activeMenuItem.classList.add("active-menu-item");
            activeMenuItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }

        elements.prevSlideBtn.style.opacity = state.currentSlide === 1 ? "0.3" : "1";
        elements.nextSlideBtn.style.opacity = state.currentSlide === state.totalSlides ? "0.3" : "1";
    }

    // SIDEBAR TOGGLE
    function toggleSidebar(open) {
        state.sidebarOpen = open;
        if (open) {
            elements.sidebar.classList.remove("collapsed");
            elements.toggleSidebarBtn.classList.remove("collapsed");
        } else {
            elements.sidebar.classList.add("collapsed");
            elements.toggleSidebarBtn.classList.add("collapsed");
        }
    }

    // AUTOPLAY CONTROL
    function toggleAutoplay() {
        state.autoplay = !state.autoplay;
        if (state.autoplay) {
            elements.playIcon.classList.add("hidden");
            elements.pauseIcon.classList.remove("hidden");
            elements.autoplayBtn.classList.add("active-btn");
            startAutoplayTimer();
        } else {
            elements.playIcon.classList.remove("hidden");
            elements.pauseIcon.classList.add("hidden");
            elements.autoplayBtn.classList.remove("active-btn");
            stopAutoplayTimer();
        }
    }

    // AUTOPLAY TIMER LOGIC
    function startAutoplayTimer() {
        stopAutoplayTimer();
        state.autoplayTimer = setInterval(() => {
            nextSlide();
        }, state.autoplayInterval);
    }

    function stopAutoplayTimer() {
        if (state.autoplayTimer) {
            clearInterval(state.autoplayTimer);
            state.autoplayTimer = null;
        }
    }

    function resetAutoplayTimer() {
        if (state.autoplay) {
            startAutoplayTimer();
        }
    }

    // MODULE-SPECIFIC LOGIC (Slide 7, 20, 21)
    function initInteractiveModules() {
        // --- 1. Ecosystem Map Node clicks (Slide 7) ---
        const ecoNodes = document.querySelectorAll(".interactive-node");
        const defaultEcoCard = document.getElementById("eco-details-default");
        const contentEcoCard = document.getElementById("eco-details-content");
        
        const detailsLogo = document.getElementById("eco-details-logo");
        const detailsTitle = document.getElementById("eco-details-title");
        const detailsDesc = document.getElementById("eco-details-desc");
        const detailsList = document.getElementById("eco-details-list");

        ecoNodes.forEach(node => {
            node.addEventListener("click", () => {
                document.querySelector(".interactive-node.selected-node")?.classList.remove("selected-node");
                node.classList.add("selected-node");

                const brandId = node.dataset.node;
                const data = ecosystemData[brandId];
                
                if (data) {
                    defaultEcoCard.classList.add("hidden");
                    contentEcoCard.classList.remove("hidden");
                    
                    detailsLogo.src = data.logo;
                    
                    // Reset dynamic styling
                    detailsLogo.style.background = "";
                    detailsLogo.style.padding = "";
                    detailsLogo.style.borderRadius = "";
                    detailsLogo.classList.remove("logo-disi");
                    
                    const lightLogos = ["logos/pumion.png", "logos/club.png", "logos/intelligence.png"];
                    if (lightLogos.includes(data.logo)) {
                        // Render white logos inside brand-colored iOS-style badges
                        detailsLogo.style.background = `var(--c-${brandId})`;
                        detailsLogo.style.padding = "6px";
                        detailsLogo.style.borderRadius = "8px";
                    }
                    
                    contentEcoCard.dataset.selectedBrand = brandId;
                    renderBrandDetails(brandId);
                }
            });
        });

        // --- 2. Global Partner Map (Slide 20) ---
        const regionPills = document.querySelectorAll(".region-pill");
        const mapDots = document.querySelectorAll(".map-glow-dot");
        const countriesBox = document.getElementById("map-region-countries");

        function highlightRegion(regionId) {
            document.querySelector(".region-pill.active-pill")?.classList.remove("active-pill");
            const activePill = document.querySelector(`.region-pill[data-region="${regionId}"]`);
            if (activePill) activePill.classList.add("active-pill");

            mapDots.forEach(dot => {
                if (dot.dataset.region === regionId) {
                    dot.classList.add("active-highlight");
                    dot.setAttribute("r", "12");
                } else {
                    dot.classList.remove("active-highlight");
                    dot.setAttribute("r", "8");
                }
            });

            const info = partnerData[regionId];
            if (info) {
                countriesBox.classList.remove("hidden");
                countriesBox.textContent = info;
                countriesBox.dataset.selectedRegion = regionId;
            }
        }

        regionPills.forEach(pill => {
            pill.addEventListener("click", () => {
                highlightRegion(pill.dataset.region);
            });
        });

        mapDots.forEach(dot => {
            dot.addEventListener("click", () => {
                highlightRegion(dot.dataset.region);
            });
        });

        // --- 3. Customer Journey Pipeline (Slide 21) ---
        const journeySteps = document.querySelectorAll(".journey-step");
        const defaultJourneyCard = document.getElementById("journey-info-default");
        const contentJourneyCard = document.getElementById("journey-info-content");
        const journeyTitle = document.getElementById("journey-info-title");
        const journeyDesc = document.getElementById("journey-info-desc");

        journeySteps.forEach(step => {
            step.addEventListener("click", () => {
                document.querySelector(".journey-step.active-step")?.classList.remove("active-step");
                step.classList.add("active-step");

                const stepId = step.dataset.step;
                const data = journeyData[stepId];
                
                if (data) {
                    defaultJourneyCard.classList.add("hidden");
                    contentJourneyCard.classList.remove("hidden");
                    contentJourneyCard.dataset.selectedStep = stepId;
                    
                    renderJourneyDetails(stepId);
                }
            });
        });
    }

    // RENDER HELPERS
    function renderBrandDetails(brandId) {
        const data = ecosystemData[brandId];
        const detailsTitle = document.getElementById("eco-details-title");
        const detailsDesc = document.getElementById("eco-details-desc");
        const detailsList = document.getElementById("eco-details-list");
        
        if (!data) return;
        
        detailsTitle.textContent = data.title;
        detailsDesc.textContent = data.desc;
        
        detailsList.innerHTML = "";
        data.items.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            detailsList.appendChild(li);
        });
    }

    function renderJourneyDetails(stepId) {
        const data = journeyData[stepId];
        const journeyTitle = document.getElementById("journey-info-title");
        const journeyDesc = document.getElementById("journey-info-desc");

        if (!data) return;

        journeyTitle.textContent = data.title;
        journeyDesc.textContent = data.desc;
    }

    // CHECK HASH ON LOAD
    if (window.location.hash) {
        const hashId = parseInt(window.location.hash.replace("#slide-", ""));
        if (hashId >= 1 && hashId <= state.totalSlides) {
            state.currentSlide = hashId;
        }
    }

    // EXECUTE
    init();
});
