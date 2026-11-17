# ISRM — повторний deployment після заміни секрету

11 листопада 2026 року. Користувач самостійно замінив ISRM_BOARD_CODE у production-налаштуваннях Cloudflare Pages isrm та прямо доручив: «запускай тоді». Значення секрету агент не вводив, не читав і не зберігав.

Повторно запущено наявний GitHub Actions run https://github.com/AlexezavGit/isrm-insight-hub/actions/runs/42756867706 (attempt 2), для того самого SHA d950d520f888285a8b5c7221366c848f22fe76e8. Нових змін коду, комітів і push не було. Workflow завершився success, включно з перевіркою поведінки, збіркою, публікацією та check published site.

Cloudflare показав новий активний production deployment https://d013fe16.isrm.pages.dev, замість попереднього https://1ed77b9d.isrm.pages.dev. Основна адреса https://isrm.pages.dev/ збережена. Код доступу після публікації має перевірити користувач; його значення агенту невідоме. Факт deployment не видається за перевірку успішного входу новим секретом.
