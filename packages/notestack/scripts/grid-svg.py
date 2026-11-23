# Generates the --ns-grid-image values in src/theme.css (run: python3 scripts/grid-svg.py).
# One combined 360px pattern (6x6 cells of 60px): lines drawn as a single path + the filled cells.
import sys, urllib.parse
M = "matrix(1.13247 -0.36397 -0.36397 1 0 0)"
CELLS = [(1,0),(4,1),(2,2),(5,3),(0,4),(3,5)]
def svg(line, line_op, cell, ops):
    lines = ''.join(f"M{x} 0h1v360h-1z" for x in range(0,360,60)) + ''.join(f"M0 {y}h360v1h-360z" for y in range(0,360,60))
    cells = ''.join(f"<rect x='{c*60}' y='{r*60}' width='60' height='60' fill-opacity='{o}'/>" for (c,r),o in zip(CELLS, ops))
    s = (f"<svg xmlns='http://www.w3.org/2000/svg' width='1024' height='1024'><defs>"
         f"<pattern id='g' width='360' height='360' patternUnits='userSpaceOnUse' patternTransform='{M}'>"
         f"<g fill='{cell}'>{cells}</g><path d='{lines}' fill='{line}' fill-opacity='{line_op}'/></pattern></defs>"
         f"<rect width='1024' height='1024' fill='url(#g)'/></svg>")
    return 'url("data:image/svg+xml,' + urllib.parse.quote(s, safe="=:/,'() ") + '")'
light = svg('rgb(136,136,136)', '0.2', 'black', ['.035','.05','.025','.03','.04','.025'])
dark = svg('rgb(136,136,136)', '0.27', 'white', ['.04','.06','.03','.035','.05','.03'])
if sys.argv[1:] == ['css']:
    print(f":root{{--ns-grid-image:{light}}}.dark{{--ns-grid-image:{dark}}}"
          "#nd-notebook-layout::after{transform:none!important;background-image:var(--ns-grid-image)!important;background-size:100% 100%!important}")
else:
    print(light); print(dark)
