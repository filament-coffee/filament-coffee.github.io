.INTERMEDIATE: css/main.inline.css


all: clean css/main.min.css

clean:
	rm css/*.css

css/main.min.css: css/main.inline.css
	./node_modules/.bin/cssmin css/main.inline.css > css/main.min.css

css/main.inline.css: css/main.css
	node ./helpers/inline.js css/main.css > css/main.inline.css

css/main.css: css/main.scss
	sass css/main.scss > css/main.css
