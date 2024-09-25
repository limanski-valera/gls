(() => {
    "use strict";
    const modules_flsModules = {};
    function getHash() {
        if (location.hash) return location.hash.replace("#", "");
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                lockPaddingElements.forEach((lockPaddingElement => {
                    lockPaddingElement.style.paddingRight = "";
                }));
                document.body.style.paddingRight = "";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        if (bodyLockStatus) {
            const lockPaddingElements = document.querySelectorAll("[data-lp]");
            const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
            lockPaddingElements.forEach((lockPaddingElement => {
                lockPaddingElement.style.paddingRight = lockPaddingValue;
            }));
            document.body.style.paddingRight = lockPaddingValue;
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function menuClose() {
        bodyUnlock();
        document.documentElement.classList.remove("menu-open");
    }
    function functions_FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    let gotoblock_gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
        const targetBlockElement = document.querySelector(targetBlock);
        if (targetBlockElement) {
            let headerItem = "";
            let headerItemHeight = 0;
            if (noHeader) {
                headerItem = "header.header";
                const headerElement = document.querySelector(headerItem);
                if (!headerElement.classList.contains("_header-scroll")) {
                    headerElement.style.cssText = `transition-duration: 0s;`;
                    headerElement.classList.add("_header-scroll");
                    headerItemHeight = headerElement.offsetHeight;
                    headerElement.classList.remove("_header-scroll");
                    setTimeout((() => {
                        headerElement.style.cssText = ``;
                    }), 0);
                } else headerItemHeight = headerElement.offsetHeight;
            }
            let options = {
                speedAsDuration: true,
                speed,
                header: headerItem,
                offset: offsetTop,
                easing: "easeOutQuad"
            };
            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
            if (typeof SmoothScroll !== "undefined") (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
                let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
                targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
                targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
                window.scrollTo({
                    top: targetBlockElementPosition,
                    behavior: "smooth"
                });
            }
            functions_FLS(`[gotoBlock]: Юхуу...їдемо до ${targetBlock}`);
        } else functions_FLS(`[gotoBlock]: Йой... Такого блоку немає на сторінці: ${targetBlock}`);
    };
    let addWindowScrollEvent = false;
    function pageNavigation() {
        document.addEventListener("click", pageNavigationAction);
        document.addEventListener("watcherCallback", pageNavigationAction);
        function pageNavigationAction(e) {
            if (e.type === "click") {
                const targetElement = e.target;
                if (targetElement.closest("[data-goto]")) {
                    const gotoLink = targetElement.closest("[data-goto]");
                    const gotoLinkSelector = gotoLink.dataset.goto ? gotoLink.dataset.goto : "";
                    const noHeader = gotoLink.hasAttribute("data-goto-header") ? true : false;
                    const gotoSpeed = gotoLink.dataset.gotoSpeed ? gotoLink.dataset.gotoSpeed : 500;
                    const offsetTop = gotoLink.dataset.gotoTop ? parseInt(gotoLink.dataset.gotoTop) : 0;
                    if (modules_flsModules.fullpage) {
                        const fullpageSection = document.querySelector(`${gotoLinkSelector}`).closest("[data-fp-section]");
                        const fullpageSectionId = fullpageSection ? +fullpageSection.dataset.fpId : null;
                        if (fullpageSectionId !== null) {
                            modules_flsModules.fullpage.switchingSection(fullpageSectionId);
                            document.documentElement.classList.contains("menu-open") ? menuClose() : null;
                        }
                    } else gotoblock_gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
                    e.preventDefault();
                }
            } else if (e.type === "watcherCallback" && e.detail) {
                const entry = e.detail.entry;
                const targetElement = entry.target;
                if (targetElement.dataset.watch === "navigator") {
                    document.querySelector(`[data-goto]._navigator-active`);
                    let navigatorCurrentItem;
                    if (targetElement.id && document.querySelector(`[data-goto="#${targetElement.id}"]`)) navigatorCurrentItem = document.querySelector(`[data-goto="#${targetElement.id}"]`); else if (targetElement.classList.length) for (let index = 0; index < targetElement.classList.length; index++) {
                        const element = targetElement.classList[index];
                        if (document.querySelector(`[data-goto=".${element}"]`)) {
                            navigatorCurrentItem = document.querySelector(`[data-goto=".${element}"]`);
                            break;
                        }
                    }
                    if (entry.isIntersecting) navigatorCurrentItem ? navigatorCurrentItem.classList.add("_navigator-active") : null; else navigatorCurrentItem ? navigatorCurrentItem.classList.remove("_navigator-active") : null;
                }
            }
        }
        if (getHash()) {
            let goToHash;
            if (document.querySelector(`#${getHash()}`)) goToHash = `#${getHash()}`; else if (document.querySelector(`.${getHash()}`)) goToHash = `.${getHash()}`;
            goToHash ? gotoblock_gotoBlock(goToHash, true, 500, 20) : null;
        }
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    class DynamicAdapt {
        constructor(type) {
            this.type = type;
        }
        init() {
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = [ ...document.querySelectorAll("[data-da]") ];
            this.nodes.forEach((node => {
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767.98";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }));
            this.arraySort(this.оbjects);
            this.mediaQueries = this.оbjects.map((({breakpoint}) => `(${this.type}-width: ${breakpoint / 16}em),${breakpoint}`)).filter(((item, index, self) => self.indexOf(item) === index));
            this.mediaQueries.forEach((media => {
                const mediaSplit = media.split(",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = this.оbjects.filter((({breakpoint}) => breakpoint === mediaBreakpoint));
                matchMedia.addEventListener("change", (() => {
                    this.mediaHandler(matchMedia, оbjectsFilter);
                }));
                this.mediaHandler(matchMedia, оbjectsFilter);
            }));
        }
        mediaHandler(matchMedia, оbjects) {
            if (matchMedia.matches) оbjects.forEach((оbject => {
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            })); else оbjects.forEach((({parent, element, index}) => {
                if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
            }));
        }
        moveTo(place, element, destination) {
            element.classList.add(this.daClassname);
            if (place === "last" || place >= destination.children.length) {
                destination.append(element);
                return;
            }
            if (place === "first") {
                destination.prepend(element);
                return;
            }
            destination.children[place].before(element);
        }
        moveBack(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (parent.children[index] !== void 0) parent.children[index].before(element); else parent.append(element);
        }
        indexInParent(parent, element) {
            return [ ...parent.children ].indexOf(element);
        }
        arraySort(arr) {
            if (this.type === "min") arr.sort(((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if (a.place === "first" || b.place === "last") return -1;
                    if (a.place === "last" || b.place === "first") return 1;
                    return 0;
                }
                return a.breakpoint - b.breakpoint;
            })); else {
                arr.sort(((a, b) => {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if (a.place === "first" || b.place === "last") return 1;
                        if (a.place === "last" || b.place === "first") return -1;
                        return 0;
                    }
                    return b.breakpoint - a.breakpoint;
                }));
                return;
            }
        }
    }
    const da = new DynamicAdapt("max");
    da.init();
    const POPUPS_DATA = [ {
        title: "Крейг Грошел",
        content: `\n\t\t<strong>Старший пастор і засновник Life.Church</strong>\n\t\t<p>\n\t\t\tВсесвітньо визнаний як лідер лідерів, Крейґ Ґрошел є засновником і старшим пастором церкви Life.Church, яка за його керівництва два роки поспіль була визнана журналом Glassdoor найкращим місцем для роботи у США. Відома своїм інноваційним підходом до використання сучасних технологій, Life.Church є розробником мобільного застосунку YouVersion Bible App, який встановлено на понад пів мільярда унікальних пристроїв по всьому світу. Він є ведучим найпопулярнішого подкасту про лідерство Craig Groeschel Leadership Podcast та автором бестселерів New York Times. Його остання книга – «Думай наперед: 7 рішень, які ти можеш прийняти сьогодні для благочестивого життя, яке бажаєш мати завтра». \n\t\t</p>`
    }, {
        title: "Ервін МакМанус",
        content: `\n\t\t<strong>Засновник церкви MOSAIC</strong>\n\t\t<p>\n\t\t\tЕрвін Рафаель МакМанус – видатний автор і художник, лауреат численних премій. Його книги розійшлися накладом понад мільйон примірників і були перекладені більш ніж на десяток мов. Завдяки своєму креативному підходу він співпрацював з такими організаціями, як НФЛ і Пентагон. Протягом останніх трьох десятиліть МакМанус консультує генеральних директорів, професійних спортсменів, компанії з мільярдними доходами, університети та світових лідерів. Він відданий меті допомагати людям долати внутрішні обмеження та розкривати їхній особистий потенціал. Родом із Сальвадору, МакМанус також заснував міжнародну церкву Mosaic у Лос-Анджелесі, яка надихає мільйони людей в усьому світі. Він навчає лідерів, підприємців та комунікаторів через платформу The Arena та свій новаторський курс "Мистецтво комунікації". Його остання книга "7 частот комунікації" вийшла влітку 2024 року.\n\t\t</p>`
    }, {
        title: "Артур Брукс",
        content: `\n\t\t<strong>Професор Гарвардського університету</strong>\n\t\t<p>\n\t\t\tАртур Брукс є професором управління громадськими та неприбутковими організаціями в Гарвардській школі Кеннеді та професором практичного менеджменту в Гарвардській школі бізнесу, де викладає курси з лідерства та щастя. Він також є колумністом журналу The Atlantic, де веде популярну рубрику «Як побудувати життя». Брукс є автором 13 книг, серед яких бестселер №1 за версією The New York Times 2023 року «Побудуй життя, яке ти хочеш: мистецтво і наука стати щасливішим», написаний у співавторстві з Опрою Вінфрі, а також бестселер №1 за версією The New York Times 2022 року «Від сили до сили: як досягти успіху, щастя і справжньої мети у другій половині життя». Він виступає перед аудиторіями по всьому світу на тему людського щастя та допомагає підвищити добробут в приватних компаніях, університетах, державних установах та громадських організаціях.\n\t\t</p>`
    }, {
        title: "Джоні Тада",
        content: `\n\t\t<strong>Засновник і генеральний директор Joni & Friends</strong>\n\t\t<p>\n\t\t\tДжоні Еріксон Тада – визнаний світовий лідер у сфері захисту прав людей з інвалідністю, а також відома християнська письменниця. Незважаючи на те, що у 1967 році нещасний випадок під час пірнання призвів до її паралічу, вона вийшла з реабілітації з рішучістю допомагати іншим у подібних ситуаціях. Тада є генеральним директором організації «Joni and Friends», яка надає підтримку тисячам сімей, що стикаються з інвалідністю. Під час її роботи у Національній раді з питань інвалідності був прийнятий і підписаний Закон для людей з інвалідністю в США. Також Тада працювала у Комітеті з питань інвалідності при Державному секретарі США Конділізі Райс. Колсонівський центр християнського світогляду відзначив її престижною премією Вільяма Вілберфорса. Вона також отримала нагороду за видатні досягнення від Християнського альянсу лідерів. Тада є натхненним наставником для молоді з інвалідністю. Як ефективний комунікатор, вона поширює своє послання через книги, мистецтво, радіо та інші медіа.\n\t\t</p>`
    }, {
        title: "Кіндра Хол",
        content: `\n\t\t<strong>Експерт зі сторітелінгу; автор бестселерів</strong>\n\t\t<p>\n\t\t\tКіндра Холл – автор бестселерів та колишня директор зі сторітелінгу в журналі Success. Вона стала визнаним експертом з мистецтва сторітелінгу в бізнесі та не тільки. Про її дебютну книгу «Історії, які чіпляють» журнали Gartner та Forbes написали, що «можливо, це найцінніша бізнес-книга, яку ви прочитаєте». В травні 2024 року вийшла її нова книга під назвою «На вістрі історії: Як лідери використовують історії для успіху в бізнесі». Ця книга допомагає лідерам краще комунікувати і надихати свої команди та компанії. Холл займалася розробкою історій для таких глобальних брендів, як Target, Univision, United Way, USO і Farmers Insurance. Вона надихає команди та окремих людей краще розповідати про цінності їхньої компанії, продукти й унікальність за допомогою стратегічного сторітелінгу.\n\t\t</p>`
    }, {
        title: "Ден Оволабі",
        content: `\n\t\t<strong>Виконавчий директор Branches Worldwide; пастор</strong>\n\t\t<p>\n\t\t\tДен Оволабі – виконавчий директор Branches Worldwide, швидкозростаючої некомерційної організації, яка займається інвестуванням у високоефективних підприємців по всьому світу. Оволабі має майже 20 років досвіду у допомозі лідерам розвивати справжній та ефективний вплив. Він працював з лідерами у 18 країнах і на чотирьох континентах, допомагаючи їм чітко визначати свою ідентичність і використовувати свій вплив для служіння іншим. Остання книга Оволабі «Автентичне лідерство» стала бестселером №1 на Amazon. Він отримав ступінь магістра в Ешлендському університеті за спеціальністю «Американське лідерство» і завершує здобуття докторського ступеня з «Глобального лідерства» в Фуллерській теологічній семінарії.  \n\t\t</p>`
    }, {
        title: "Вілл Гвідара",
        content: `\n\t\t<strong>Популяризатор гостинності; ресторатор; автор бестселерів</strong>\n\t\t<p>\n\t\t\tВілл Гідара – автор бестселера New York Times «Надмірна гостинність», у якому він ділиться важливими уроками сервісу та лідерства, здобутими протягом кар'єри в ресторанному бізнесі. Він був співвласником ресторану Eleven Madison Park на Манхеттені, який під його керівництвом отримав чотири зірки від New York Times, три зірки Мішлен і в 2017 році був визнаний №1 у списку 50 найкращих ресторанів світу. Гідара також є ведучим Welcome Conference – щорічного форуму з гостинності, який об'єднує професіоналів для обміну ідеями та формування спільноти. Випускник Школи гостинності Корнельського університету, він є співавтором чотирьох кулінарних книг, був включений до рейтингу видання Crain's New York Business «40 до 40» та відзначений нагородою «Новатор» від журналу WSJ.\n\t\t</p>`
    }, {
        title: "Маркус Бакінгем",
        content: `\n\t\t<strong>Міжнародний дослідник; підприємець; засновник Strengths Revolution</strong>\n\t\t<p>\n\t\t\tМаркус Бакінгем – найвідоміший у світі дослідник сильних сторін характеру, лідерства та високої продуктивності на роботі. Після 20 років вивчення досконалості та розробки інструменту StrengthsFinder у Gallup Organization він заснував власну компанію з розробки програмного забезпечення, яка допомагає лідерам команд досягати успіху.\n\t\t</p>\n\t\t<p>\n\t\t\tСьогодні він очолює глобальні дослідження ADP Research Institute, присвячені вивченню людей та продуктивності на роботі. Бакінгем є автором двох бізнес-бестселерів усіх часів і двох найпопулярніших впливових статей у Harvard Business Review. Його здобутки ґрунтовно висвітлювалися в публікаціях The New York Times, Wall Street Journal, USA Today, Forbes, Fortune, The Today Show та The Oprah Winfrey Show. Його остання книга «Любов + робота» розкриває здатність любові виявляти справжню силу людини і вчить, як спрямувати цю силу на користь в особистому житті та роботі.\n\t\t</p>`
    }, {
        title: "Девід Eшкрафт",
        content: `\n\t\t<strong>Президент і генеральний директор GLN</strong>\n\t\t<p>\n\t\t\tДевід Ешкрафт є президентом і генеральним директором Глобальної лідерської мережі (GLN) – організації з розвитку міжнародного лідерства, яка прагне служити пасторам, оснащувати церкви та надихати лідерів. Раніше Девід ніс служіння пастора церкви LCBC (Життя, змінені Христом) в Манхеймі, штат Пенсильванія. Під його керівництвом церква LCBC виросла з одного служіння зі 150 відвідувачами щотижня до 19 церков по всьому штату Пенсильванія з середньою щотижневою відвідуваністю понад 22 000 осіб. Крім того, Девід є засновником і президентом The Advantage, спільноти лідерів, метою якої є наставництво і заохочення пасторів по всій країні. Він є автором книги «Про що я думав?», яка вчить нас правильно ухвалювати рішення. Девід також є членом Ради директорів Глобальної лідерської мережі та Національної асоціації євангельських християн.\n\t\t</p>`
    }, {
        title: "Руслан Кухарчук ",
        content: `\n\t\t<strong>ГЛС Україна, Національний партнер</strong>\n\t\t<p>\n\t\t\tГолова руху «Всі разом!» та аналітичного центру Кабінет експертів. Президент Асоціації журналістів «Новомедіа» та оргкомітету міжнародного Новомедіа Форуму. Лідер національного руху «Всі разом – за сім’ю». У різні періоди є співробітником українських телеканалів, а також друкованих і електронних ЗМІ у якості репортера, парламентського кореспондента, випускового редактора, ведучого, головного редактора. Промовець, викладач, проповідник. Автор трьох книг — «Десятка», «Мандат», «Секс після контузії». Співавтор і редактор книги «Новий журналіст». Має журналістську, режисерську та богословську освіту.\n\t\t</p>`
    } ];
    function initPopups() {
        const speakers = document.querySelectorAll(".speaker");
        speakers.forEach(((speaker, index) => {
            const popupData = POPUPS_DATA[index];
            if (!popupData) {
                console.error("Speakers count in html should equal POPUPS_DATA.length in js");
                return;
            }
            const speakerPopup = new Popup({
                id: `speaker${index}`,
                backgroundColor: "#009cde",
                titleColor: "#fff",
                textColor: "#fff",
                closeColor: "#fff",
                ...popupData
            });
            speaker.addEventListener("click", (e => {
                if (e.target.closest(".speaker__image") || e.target.closest(".speaker__name-link")) {
                    e.preventDefault();
                    try {
                        speakerPopup.show();
                    } catch (e) {
                        console.error("Popup is not ready yet.");
                    }
                }
            }));
        }));
    }
    document.addEventListener("DOMContentLoaded", initPopups);
    window["FLS"] = true;
    menuInit();
    pageNavigation();
})();