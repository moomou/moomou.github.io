SASSC = sass

# Build stylesheets
STYLESRC = $(wildcard css/*.scss)
STYLEOBJ = ${STYLESRC:.scss=.css}
STYLEOUT = css/compiled.css

$(STYLEOUT): $(STYLEOBJ)
	awk 'FNR==1{print ""}1' $^ > $@

%.css: %.scss
	$(SASSC) -C $< > $@

.PHONY: style
style: $(STYLEOUT)

.PHONY: all
all: style

.PHONY: clean
clean:
	-rm $(STYLEOBJ)
