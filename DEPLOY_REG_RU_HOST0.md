# Деплой на REG.RU Host-0

Инструкция для проекта `compound-calc`: React + Vite, статическая сборка с пререндерингом страниц. На тарифе REG.RU Host-0 запускать Node.js на сервере не нужно: сайт собирается локально, а на хостинг загружается содержимое папки `dist`.

## 1. Что понадобится

- Доступ в личный кабинет REG.RU.
- Активный тариф Hosting Linux Host-0.
- Домен, привязанный к услуге хостинга.
- FTP/SFTP или доступ к файловому менеджеру панели хостинга.
- Локально установленный Node.js и npm.

Важно: на сервер загружается не исходный код проекта, а только готовые файлы из `dist`.

## 2. Подготовить домен в REG.RU

1. В личном кабинете REG.RU откройте услугу хостинга.
2. Перейдите в панель управления хостингом.
3. В разделе сайтов/доменов добавьте нужный домен, если он еще не добавлен.
4. Проверьте корневую директорию сайта.

Типовые абсолютные пути для Hosting Linux:

- `ispmanager`: `/var/www/u1234567/data/www/example.ru/`
- `Plesk`: `/var/www/vhosts/u1234567.plsk.regruhosting.ru/example.ru/`
- `cPanel`: `/var/www/u1234567/example.ru/`

`u1234567` замените на логин хостинга, `example.ru` - на домен проекта.

## 3. Проверить переменные перед сборкой

В проекте используется `VITE_BASE_URL`, он влияет на canonical URL и sitemap.

Для боевого домена в файле `.env` должно быть:

```env
VITE_BASE_URL=https://calcportal.online
```

Если домен будет другой, замените значение до сборки.

Дополнительные переменные аналитики и рекламы, если нужны:

```env
VITE_YM_ID=
VITE_GA_ID=
VITE_RSYA_ENABLED=false
VITE_RSYA_BLOCK_HOME=
VITE_RSYA_BLOCK_HOME_BOTTOM=
VITE_RSYA_BLOCK_RESULT=
VITE_RSYA_BLOCK_FOOTER=
```

Файл `.env` на хостинг загружать не нужно. Vite подставляет эти значения во время сборки.

## 4. Собрать сайт локально

Из корня проекта:

```powershell
npm ci
npm test
npm run build
```

После успешной сборки проверьте, что появилась/обновилась папка:

```text
C:\claude_calc\dist
```

Внутри должны быть `index.html`, `sitemap.xml`, `robots.txt`, `assets/` и папки страниц вроде `credit/`, `deposit/`, `mortgage/`.

## 5. Загрузить файлы на хостинг

Загружайте содержимое папки `dist`, а не саму папку `dist`.

Итог в корневой директории домена должен быть примерно таким:

```text
example.ru/
  index.html
  sitemap.xml
  robots.txt
  favicon.svg
  assets/
  credit/
  deposit/
  mortgage/
  ...
```

### Вариант A: через файловый менеджер REG.RU

1. Откройте панель управления хостингом.
2. Перейдите в файловый менеджер.
3. Откройте корневую директорию домена.
4. Удалите старые файлы сайта или перенесите их в резервную папку.
5. Загрузите архив с содержимым `dist`.
6. Распакуйте архив прямо в корневую директорию домена.
7. Убедитесь, что `index.html` лежит сразу в корне домена, а не внутри `dist/`.

### Вариант B: через SFTP/FTP

Подключитесь через WinSCP, FileZilla или другой клиент:

- host: IP-адрес или сервер хостинга из панели REG.RU;
- login: логин хостинга вида `u1234567`;
- password: пароль от FTP/SFTP/SSH;
- protocol: лучше SFTP, если доступен.

Затем загрузите все файлы из `C:\claude_calc\dist` в корневую директорию домена.

### Вариант C: через SSH/scp

Если SSH включен, можно загрузить архив и распаковать его на сервере.

Локально создайте архив содержимого `dist`:

```powershell
Compress-Archive -Path C:\claude_calc\dist\* -DestinationPath C:\claude_calc\dist-reg-ru.zip -Force
```

Загрузите архив:

```powershell
scp C:\claude_calc\dist-reg-ru.zip u1234567@SERVER_IP:/var/www/u1234567/data/www/example.ru/
```

На сервере:

```bash
cd /var/www/u1234567/data/www/example.ru/
unzip -o dist-reg-ru.zip
rm dist-reg-ru.zip
```

Путь замените на реальную корневую директорию из панели REG.RU.

## 6. Проверить после деплоя

Откройте:

- `https://calcportal.online/`
- `https://calcportal.online/credit`
- `https://calcportal.online/deposit`
- `https://calcportal.online/sitemap.xml`
- `https://calcportal.online/robots.txt`

Проверьте:

- главная страница открывается без парковочной страницы REG.RU;
- прямые ссылки на страницы открываются без 404;
- в `robots.txt` указан правильный `Sitemap`;
- в `sitemap.xml` указан боевой домен;
- в DevTools нет 404 на файлы из `/assets/`.

## 7. Обновление сайта

При каждом обновлении:

```powershell
npm ci
npm test
npm run build
```

Затем снова загрузите содержимое `dist` в корневую директорию домена с заменой старых файлов.

Чтобы избежать смеси старых и новых assets, лучше перед загрузкой удалить старую папку `assets/` на хостинге.

## 8. Типовые проблемы

### Открывается страница "Сайт зарегистрирован в REG.RU"

Файлы сайта не загружены в корневую директорию домена или в корне остался парковочный файл. Проверьте путь в панели управления и наличие `index.html` сразу в корне домена.

### Открывается список файлов или ошибка 403

`index.html` лежит не в корне домена. Частая ошибка - загрузить папку `dist` целиком, из-за чего получается `example.ru/dist/index.html`.

### В sitemap старый домен

Проверьте `.env`, затем пересоберите сайт:

```powershell
npm run build
```

После этого загрузите новый `sitemap.xml` и HTML-файлы.

### Прямые ссылки дают 404

В этом проекте сборка создает папки с `index.html` для основных маршрутов, поэтому прямые ссылки должны открываться без server-side Node.js. Если добавили новый маршрут, но он дает 404, проверьте, что маршрут добавлен в генерацию sitemap/prerender и после сборки появился в `dist`.

## 9. Когда нужен .htaccess

Для текущей сборки `.htaccess` не обязателен. Он может понадобиться только для дополнительных серверных правил: редирект с `www` на без `www`, принудительный HTTPS, кэширование или fallback для непререндеренных SPA-страниц.

Минимальный пример редиректа с `www` на без `www`:

```apacheconf
RewriteEngine On
RewriteCond %{HTTP_HOST} ^www\.calcportal\.online$ [NC]
RewriteRule ^(.*)$ https://calcportal.online/$1 [R=301,L]
```

Перед добавлением таких правил проверьте, не включены ли аналогичные редиректы уже в панели REG.RU.

## 10. Полезные ссылки REG.RU

- Корневая папка сайта: https://help.reg.ru/support/hosting/razmeshcheniye-sayta-otobrazheniye-v-brauzere/kornevaya-papka-sayta
- SSH на виртуальном хостинге: https://help.reg.ru/support/hosting/dostupy-i-podklyucheniye-panel-upravleniya-ftp-ssh/rabota-po-ssh-na-virtualnom-hostinge
- `.htaccess` на хостинге: https://help.reg.ru/support/hosting/fayly-web-config-i-htaccess/kak-sozdat-fayl-htaccess
- Проблемы с `.htaccess`: https://help.reg.ru/support/hosting/fayly-web-config-i-htaccess/problemy-s-htaccess
