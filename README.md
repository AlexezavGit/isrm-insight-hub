# ISRM Insight Hub

Спроектувати та створити робочу демонстрацію (MVP) цифрової платформи для закритої експертної мережі ISRM Ukraine на основі наданих даних (ISRM_Ukraine_Community_CRM_178_FandP.xlsx та підготовленого JSON).

Вимоги:
1. Інтерактивна візуалізація мережі у вигляді графа (Force-directed graph): вузли — експерти та кластери експертизи/секторів/хабів, ребра — зв'язки та спільні домени. Можливість фільтрації, масштабування, фокусування на конкретному експерті та його оточенні.
2. Система рівнів доступу та приватності:
- За замовчуванням (демо-режим / гість): усі дані знеособлені (псевдоніми на кшталт EXP-042 / Expert #042, сектор, приховані прямі контакти, показуються лише аналітичні зрізи та рівні верифікації).
- Розкриття повних даних: за кодом/ім'ям рекомендодавця або введенням адміністративного пароля (наприклад, доступ для координатора чи ЛПР).
3. Пошук і фільтри за 178 записами: статус верифікації (45 Verified vs Черга ресерчу), сектор, географія, теми українського досвіду, роль в ISRM.
4. Досьє / Профіль експерта з оцінкою рівня довіри, компетенціями та кнопкою безпечного запиту контакту через координатора.
5. Режим «Артефакт-пропозиція»: повний інтерактивний перелік функцій системи та опис архітектури (у вигляді покрокового туторіалу/гайду по функціях для ЛПР, з можливістю перегляду дорожньої карти та надсилання пропозицій/відгуку у кабінет координатора).
6. Преміальний, стриманий дизайн для топ-менеджменту та аналітиків (темна/графітова тема, висока щільність даних, відсутність візуального шуму).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/264c6a0e-6111-4dd6-829e-04ea8e867e5b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
