# Requirements
- Web Server (Apache / NGINX / Traefik / Visual Studio Code Live Server)

# Tools
- Visual Studio Code
- Git
- Docker (Optional)

# Tech Stacks
- angular.js v1.8.3
- angular-i18n v1.8.3
- angular-sanitize v1.8.3
- angular-animate v1.8.3
- angular-translate v2.19.1
- ngstorage v0.3.11
- angular-ui-router v1.1.0
- angular-chart.js v1.1.1
- Chart.js v2.9.4
- chartjs-plugin-datalabels V1.0.0

# Design
- Fonts - Montserrat
- CSS - Bulma CSS
- Icons - Font Awesome 6.5.2

## Colors
- Green '#48C78E'
- Warning '#FFb70F'
- Red '#FF6685'

# Feature
- Detects Incomplete Data
- Switch between Table and Column Chart
- Compare workload between Lecturers in 1 Sessions
- Compare a lecturer's workload across all sessions
- Fetch pre-calculated JSON available
- Implemented fetch chaining to fetch data sequentically according to semester.
- Implemented localStorage to cache calculated data.
- Implemented minified js to reduce file size.
- Utilized cdnjs CDN to reduce server traffic of UTM-FC.
- Implemented minified JavaScript file to reduce file size.

## Docker Build
```docker build -t timetable-a .```

## Docker Run
```docker run --name timetable-a -p 8080:80 -d timetable-a```

## Docker Stop
```docker stop timetable-a```

# Improvement
- Automated Unit Testing with Vitest

# Unit Testing (Incomplete)
For More Details Please Refer
[/testing/unit/README.md](/testing/unit/README.md)

# Reference
- [AngularJS Style Guide JohnPapa](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#application-structure-lift-principles)
- [AngularJS Style Guide ToddMotto](https://github.com/toddmotto/angularjs-styleguide)
- [AngularJS External Resources](https://docs.angularjs.org/guide/external-resources)