
#!/bin/bash 

TEX="lualatex"
OUT_DIR=out
BIN_DIR=$( dirname -- $0; )

# rm -rf $OUT_DIR
mkdir -p $OUT_DIR

COMPANY="$1"


$BIN_DIR/xelatex \
  --halt-on-error \
  -output-directory="$OUT_DIR" \
  "\def\outCompany{$COMPANY}\input{Cover.tex}"

mv "$OUT_DIR/Cover.pdf" "$OUT_DIR/Cover-$COMPANY.pdf"
