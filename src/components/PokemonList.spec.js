const { mount } = require("@vue/test-utils");
const PokemonList = require("../components/PokemonList.vue")


describe('PokemonList', () => {
  it('renders pokemon name and type correctly', () => {
    const wrapper = mount(PokemonList, {
      props: {
        name: 'Pikachu',
        urlBaseSvg: 'https://example.com/pikachu.png',
        ids: 25,
        type: 'Electric'
      }
    });

    expect(wrapper.find('.text-center').text()).toBe('Pikachu');
    expect(wrapper.find('.styleType').text()).toBe('Electric');
  });

  it('changes background color on hover', async () => {
    const wrapper = mount(PokemonList, {
      props: {
        name: 'Bulbasaur',
        urlBaseSvg: 'https://example.com/bulbasaur.png',
        ids: 1,
        type: 'Grass/Poison'
      }
    });

    await wrapper.trigger('mouseenter');
    expect(wrapper.classes()).toContain('cardListPokemonHover');
    
    await wrapper.trigger('mouseleave');
    expect(wrapper.classes()).not.toContain('cardListPokemonHover');
  });
});