import renderString from "src/renders/SVGRender";

describe('Test: SVGRender', () => {
    describe('Test function: renderString', () => {
        it('renderString should replace "N{{...}}" by number', () => {
            expect(renderString('<svg id="N{{id}}"></svg>', { id: 1 })).toEqual('<svg id="1"></svg>');
        });

        it('renderString should replace "T{{...}}" by text', () => {
            expect(renderString('<svg id="T{{id}}"></svg>', { id: 'test' })).toEqual('<svg id="test"></svg>');
        });
    });
});