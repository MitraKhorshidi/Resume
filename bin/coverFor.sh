
#!/bin/bash 

TEX="lualatex"
OUT_DIR=out
BIN_DIR=$( dirname -- $0; )

# rm -rf $OUT_DIR
mkdir -p $OUT_DIR

POSITION="$1"
COMPANY="$2"
COMPANYFULL="${3:-$COMPANY}"

echo Job Position: $POSITION
echo Company Name: $COMPANY
echo Company Full: $COMPANYFULL

$BIN_DIR/xelatex \
  --halt-on-error \
  -output-directory="$OUT_DIR" \
  "\def\outPosition{$POSITION}\def\outCompany{$COMPANYFULL}\input{Cover.tex}" \
  > /dev/null \
  || exit 1


mv "$OUT_DIR/Cover.pdf" "$OUT_DIR/Cover-$COMPANY.pdf"
