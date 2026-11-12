/**
 * MaxMobila - Visual Gutenberg Blocks
 * Renders the authentic visual template of MaxMobila inside WordPress Editor
 */
(function() {
  'use strict';

  if (!window.wp || !wp.blocks || !wp.element) {
    return;
  }

  const { registerBlockType } = wp.blocks;
  const { createElement: el, Fragment } = wp.element;
  const { RichText, InspectorControls } = wp.blockEditor || wp.editor;
  const { PanelBody, TextControl, RangeControl, SelectControl } = wp.components;

  const DATA = window.MAXMOBILA_BLOCKS_DATA || {
    assetsUrl: '/wp-content/plugins/plugin-maxmobila/assets/images/',
    store: { phone: '+40 700 000 000', city: 'Satu Mare', warrantyYears: 2 },
    categories: [],
    states: [],
    products: [],
    faq: []
  };

  const CAT_MAP = {};
  (DATA.categories || []).forEach(c => { CAT_MAP[c.id] = c.name; });

  function getImgUrl(p) {
    if (!p) return '';
    if (p.custom_img) return p.custom_img;
    const key = p.img || 'p00';
    return DATA.assetsUrl + key + '.webp';
  }

  function formatLei(amt) {
    return Number(amt || 0).toLocaleString('ro-RO') + ' lei';
  }

  function renderCard(p) {
    if (!p) return null;
    const disc = (p.newRON && p.priceRON && p.newRON > p.priceRON)
      ? Math.round((1 - p.priceRON / p.newRON) * 100) : 0;
    const catName = CAT_MAP[p.cat] || p.cat;
    const metaStr = [catName, p.material, p.color].filter(Boolean).join(' · ') + (p.dims ? (' · ' + p.dims) : '');

    return el('article', { className: 'pc', key: p.id },
      el('a', { className: 'ph', href: '#' },
        el('img', { src: getImgUrl(p), alt: p.name, loading: 'lazy' })
      ),
      el('span', { className: 'tl' },
        el('span', { className: 'st ' + (p.state || 'nou') }, (p.state || 'Nou').toUpperCase())
      ),
      el('span', { className: 'tr off' }, '−' + disc + '%'),
      el('div', { className: 'bd' },
        el('span', { className: 'pc-brand' }, 'COLECȚIA GERMANIA'),
        el('a', { href: '#' }, el('h3', null, p.name)),
        el('div', { className: 'meta' }, metaStr),
        el('div', { className: 'pr' },
          el('div', null,
            el('div', { className: 'was' }, 'Preț nou: ', el('s', null, formatLei(p.newRON))),
            el('div', { className: 'price num' }, formatLei(p.priceRON))
          ),
          el('div', { className: 'pc-acts' },
            el('button', { className: 'pc-fav', 'aria-label': 'Favorite' }, '♡'),
            el('button', { className: 'addb', 'aria-label': 'Adaugă în coș' }, '🛒')
          )
        )
      )
    );
  }

  function blockBadge(label) {
    return el('div', { className: 'maxmobila-editor-badge' },
      el('i', null),
      el('span', null, 'Secțiune Magazin: ' + label)
    );
  }

  /* ========================================================
   * 1. HERO BANNER
   * ======================================================== */
  registerBlockType('maxmobila/hero', {
    title: 'Hero Banner (MaxMobila)',
    icon: 'cover-image',
    category: 'maxmobila',
    description: 'Bannerul principal cu mesaj, statistici de stoc/reducere și colaj de produse',
    attributes: {
      eyebrow: { type: 'string', default: 'Direct din Germania' },
      title: { type: 'string', default: 'Mobilă nemțească.<br><em>Preț de outlet.</em>' },
      lead: { type: 'string', default: 'Canapele, paturi, mese și dulapuri din surplusul magazinelor din Germania. Fiecare piesă are starea scrisă clar: nou, resigilat, expus sau cu mici defecte.' },
      btn_text: { type: 'string', default: 'Vezi reducerile' },
      btn_link: { type: 'string', default: '#/produse?sort=disc' },
      btn2_text: { type: 'string', default: 'Toate produsele' },
      btn2_link: { type: 'string', default: '#/produse' }
    },
    edit: function(props) {
      const { attributes, setAttributes } = props;
      const heroProds = (DATA.products || []).slice(0, 3);
      const totalCount = DATA.products ? DATA.products.length : 49;
      const warranty = DATA.store ? (DATA.store.warrantyYears || 2) : 2;

      return el('div', { className: 'maxmobila-block-wrapper' },
        blockBadge('Hero Principal'),
        el(InspectorControls, null,
          el(PanelBody, { title: 'Setări Butoane Hero', initialOpen: true },
            el(TextControl, {
              label: 'Text Buton Principal',
              value: attributes.btn_text,
              onChange: val => setAttributes({ btn_text: val })
            }),
            el(TextControl, {
              label: 'Link Buton Principal',
              value: attributes.btn_link,
              onChange: val => setAttributes({ btn_link: val })
            }),
            el(TextControl, {
              label: 'Text Buton Secundar',
              value: attributes.btn2_text,
              onChange: val => setAttributes({ btn2_text: val })
            }),
            el(TextControl, {
              label: 'Link Buton Secundar',
              value: attributes.btn2_link,
              onChange: val => setAttributes({ btn2_link: val })
            })
          )
        ),
        el('section', { className: 'hero' },
          el('div', { className: 'wrap g' },
            el('div', null,
              el(RichText, {
                tagName: 'div',
                className: 'eyebrow',
                value: attributes.eyebrow,
                onChange: val => setAttributes({ eyebrow: val }),
                placeholder: 'Eyebrow...'
              }),
              el(RichText, {
                tagName: 'h1',
                value: attributes.title,
                onChange: val => setAttributes({ title: val }),
                placeholder: 'Titlu Hero...'
              }),
              el(RichText, {
                tagName: 'p',
                className: 'lead',
                value: attributes.lead,
                onChange: val => setAttributes({ lead: val }),
                placeholder: 'Paragraf introductiv...'
              }),
              el('div', { className: 'ctas' },
                el('a', { className: 'btn red', href: '#' }, attributes.btn_text + ' →'),
                el('a', { className: 'btn outl', href: '#' }, attributes.btn2_text)
              ),
              el('div', { className: 'hstats' },
                el('div', null,
                  el('b', { className: 'num' }, totalCount),
                  el('span', null, 'produse în stoc')
                ),
                el('div', null,
                  el('b', { className: 'num' }, '−45%'),
                  el('span', null, 'reducere medie')
                ),
                el('div', null,
                  el('b', null, warranty + ' ani'),
                  el('span', null, 'garanție')
                )
              )
            ),
            el('div', { className: 'collage' },
              heroProds.map((p, i) => {
                const disc = Math.round((1 - p.priceRON / p.newRON) * 100);
                return el('a', { className: 'tile ' + (i === 0 ? 'big' : ''), key: p.id, href: '#' },
                  el('img', { src: getImgUrl(p), alt: p.name }),
                  el('span', { className: 'off' }, '−' + disc + '%'),
                  el('span', { className: 'tag' },
                    el('small', null, formatLei(p.newRON)),
                    el('b', { className: 'num' }, formatLei(p.priceRON))
                  )
                );
              })
            )
          )
        )
      );
    },
    save: function() { return null; }
  });

  /* ========================================================
   * 2. CATEGORII PRODUSE
   * ======================================================== */
  registerBlockType('maxmobila/categorii', {
    title: 'Categorii (MaxMobila)',
    icon: 'grid-view',
    category: 'maxmobila',
    description: 'Grila celor 10 categorii de mobilă cu imagini și prețuri de pornire',
    attributes: {
      title: { type: 'string', default: 'Categorii' },
      subtitle: { type: 'string', default: 'Alege camera, noi avem piesa.' }
    },
    edit: function(props) {
      const { attributes, setAttributes } = props;
      const categories = DATA.categories || [];
      const prods = DATA.products || [];

      return el('div', { className: 'maxmobila-block-wrapper' },
        blockBadge('Categorii de Produse'),
        el('section', { className: 'sec white' },
          el('div', { className: 'wrap' },
            el('div', { className: 'sh' },
              el('div', null,
                el(RichText, {
                  tagName: 'h2',
                  value: attributes.title,
                  onChange: val => setAttributes({ title: val }),
                  placeholder: 'Titlu categorii...'
                }),
                el(RichText, {
                  tagName: 'p',
                  value: attributes.subtitle,
                  onChange: val => setAttributes({ subtitle: val }),
                  placeholder: 'Subtitlu...'
                })
              ),
              el('a', { className: 'more', href: '#' }, 'Toate cele ' + prods.length + ' de produse')
            ),
            el('div', { className: 'catgrid' },
              categories.map(c => {
                const inC = prods.filter(p => p.cat === c.id);
                const firstP = inC[0];
                const minPrice = inC.length ? Math.min(...inC.map(p => p.priceRON)) : 0;
                return el('a', { className: 'cat', key: c.id, href: '#' },
                  el('span', { className: 'im' },
                    firstP ? el('img', { src: getImgUrl(firstP), alt: c.name }) : null
                  ),
                  el('b', null, c.name),
                  el('span', null, inC.length + ' produse · de la ' + formatLei(minPrice))
                );
              })
            )
          )
        )
      );
    },
    save: function() { return null; }
  });

  /* ========================================================
   * 3. TOP REDUCERI
   * ======================================================== */
  registerBlockType('maxmobila/top-reduceri', {
    title: 'Top Reduceri (MaxMobila)',
    icon: 'tag',
    category: 'maxmobila',
    description: 'Grilă cu produsele care au cel mai mare discount din magazin',
    attributes: {
      title: { type: 'string', default: 'Cele mai mari reduceri' },
      subtitle: { type: 'string', default: 'Față de prețul nou din Germania.' },
      limit: { type: 'number', default: 8 }
    },
    edit: function(props) {
      const { attributes, setAttributes } = props;
      const sorted = [...(DATA.products || [])].sort((a, b) => {
        const da = (1 - a.priceRON / a.newRON);
        const db = (1 - b.priceRON / b.newRON);
        return db - da;
      }).slice(0, attributes.limit || 8);

      return el('div', { className: 'maxmobila-block-wrapper' },
        blockBadge('Top Reduceri'),
        el(InspectorControls, null,
          el(PanelBody, { title: 'Setări Afișare', initialOpen: true },
            el(RangeControl, {
              label: 'Număr de produse afișate',
              value: attributes.limit,
              onChange: val => setAttributes({ limit: val }),
              min: 2,
              max: 20,
              step: 2
            })
          )
        ),
        el('section', { className: 'sec' },
          el('div', { className: 'wrap' },
            el('div', { className: 'sh' },
              el('div', null,
                el(RichText, {
                  tagName: 'h2',
                  value: attributes.title,
                  onChange: val => setAttributes({ title: val }),
                  placeholder: 'Titlu...'
                }),
                el(RichText, {
                  tagName: 'p',
                  value: attributes.subtitle,
                  onChange: val => setAttributes({ subtitle: val }),
                  placeholder: 'Subtitlu...'
                })
              ),
              el('a', { className: 'more', href: '#' }, 'Vezi toate')
            ),
            el('div', { className: 'grid' },
              sorted.map(p => renderCard(p))
            )
          )
        )
      );
    },
    save: function() { return null; }
  });

  /* ========================================================
   * 4. STĂRI PRODUSE
   * ======================================================== */
  registerBlockType('maxmobila/stari', {
    title: 'Stări Produse (MaxMobila)',
    icon: 'yes-alt',
    category: 'maxmobila',
    description: 'Cele 4 stări ale mobilierului: Nou, Resigilat, Expus, Mici defecte',
    attributes: {
      title: { type: 'string', default: 'Știi exact ce cumperi' },
      subtitle: { type: 'string', default: 'Fiecare produs are una din cele 4 stări. Filtrezi după ea în catalog.' }
    },
    edit: function(props) {
      const { attributes, setAttributes } = props;
      const states = DATA.states || [];
      const prods = DATA.products || [];

      return el('div', { className: 'maxmobila-block-wrapper' },
        blockBadge('Stări Mobilă Outlet'),
        el('section', { className: 'sec white' },
          el('div', { className: 'wrap' },
            el('div', { className: 'sh' },
              el('div', null,
                el(RichText, {
                  tagName: 'h2',
                  value: attributes.title,
                  onChange: val => setAttributes({ title: val }),
                  placeholder: 'Titlu secțiune stări...'
                }),
                el(RichText, {
                  tagName: 'p',
                  value: attributes.subtitle,
                  onChange: val => setAttributes({ subtitle: val }),
                  placeholder: 'Subtitlu...'
                })
              )
            ),
            el('div', { className: 'states' },
              states.map(s => {
                const count = prods.filter(p => p.state === s.id).length;
                return el('a', { key: s.id, href: '#' },
                  el('span', { className: 'st ' + s.id }, s.name),
                  el('b', null, s.short),
                  el('p', null, s.desc),
                  el('span', { className: 'cnt' }, count + ' produse →')
                );
              })
            )
          )
        )
      );
    },
    save: function() { return null; }
  });

  /* ========================================================
   * 5. SHOWROOM BANNER
   * ======================================================== */
  registerBlockType('maxmobila/showroom-banner', {
    title: 'Banner Showroom (MaxMobila)',
    icon: 'location-alt',
    category: 'maxmobila',
    description: 'Banner de promovare a vizitelor la depozit și apelare telefonică',
    attributes: {
      eyebrow: { type: 'string', default: 'Showroom Satu Mare' },
      title: { type: 'string', default: 'Vezi mobila pe viu înainte să o cumperi' },
      lead: { type: 'string', default: 'Toate produsele sunt în depozitul nostru. Sună, programăm vizita și testezi canapeaua înainte să plătești.' },
      phone: { type: 'string', default: '+40 700 000 000' },
      btn_text: { type: 'string', default: 'Sună acum' },
      btn2_text: { type: 'string', default: 'Programează vizita' }
    },
    edit: function(props) {
      const { attributes, setAttributes } = props;

      return el('div', { className: 'maxmobila-block-wrapper' },
        blockBadge('Banner Showroom & Depozit'),
        el('section', { className: 'sec' },
          el('div', { className: 'wrap' },
            el('div', { className: 'band' },
              el('div', null,
                el(RichText, {
                  tagName: 'div',
                  className: 'eyebrow',
                  style: { color: 'var(--gold)' },
                  value: attributes.eyebrow,
                  onChange: val => setAttributes({ eyebrow: val }),
                  placeholder: 'Showroom Oraș...'
                }),
                el(RichText, {
                  tagName: 'h2',
                  value: attributes.title,
                  onChange: val => setAttributes({ title: val }),
                  placeholder: 'Titlu banner...'
                }),
                el(RichText, {
                  tagName: 'p',
                  value: attributes.lead,
                  onChange: val => setAttributes({ lead: val }),
                  placeholder: 'Descriere...'
                })
              ),
              el('div', null,
                el(RichText, {
                  tagName: 'div',
                  className: 'ph',
                  value: attributes.phone,
                  onChange: val => setAttributes({ phone: val }),
                  placeholder: 'Telefon...'
                }),
                el('div', { className: 'row' },
                  el('a', { className: 'btn red', href: '#' }, attributes.btn_text),
                  el('a', { className: 'btn outl', style: { background: 'transparent', color: '#fff', borderColor: '#fff' }, href: '#' }, attributes.btn2_text)
                )
              )
            )
          )
        )
      );
    },
    save: function() { return null; }
  });

  /* ========================================================
   * 6. FAQ (ÎNTREBĂRI FRECVENTE)
   * ======================================================== */
  registerBlockType('maxmobila/faq', {
    title: 'Întrebări Frecvente (MaxMobila)',
    icon: 'editor-help',
    category: 'maxmobila',
    description: 'Secțiune acordeon cu cele mai frecvente întrebări ale clienților',
    attributes: {
      title: { type: 'string', default: 'Întrebări frecvente' }
    },
    edit: function(props) {
      const { attributes, setAttributes } = props;
      const faqList = DATA.faq || [];

      return el('div', { className: 'maxmobila-block-wrapper' },
        blockBadge('Întrebări Frecvente (FAQ)'),
        el('section', { className: 'sec white', id: 'faq' },
          el('div', { className: 'wrap' },
            el('div', { className: 'sh' },
              el('div', null,
                el(RichText, {
                  tagName: 'h2',
                  value: attributes.title,
                  onChange: val => setAttributes({ title: val }),
                  placeholder: 'Titlu FAQ...'
                })
              )
            ),
            el('div', { className: 'faq' },
              faqList.map((item, idx) => {
                return el('details', { className: 'card', key: idx, open: idx === 0 },
                  el('summary', null, item[0]),
                  el('div', null, item[1])
                );
              })
            )
          )
        )
      );
    },
    save: function() { return null; }
  });

  /* ========================================================
   * 7. CATALOG PRODUSE CU FILTRE
   * ======================================================== */
  registerBlockType('maxmobila/catalog', {
    title: 'Catalog cu Filtre (MaxMobila)',
    icon: 'store',
    category: 'maxmobila',
    description: 'Catalogul interactiv complet cu filtre laterale (categorii, stare, buget) și sortare',
    attributes: {
      title: { type: 'string', default: 'Toate produsele' },
      preview_mode: { type: 'string', default: 'grid' },
      preview_count: { type: 'number', default: 6 }
    },
    edit: function(props) {
      const { attributes, setAttributes } = props;
      const count = attributes.preview_count || 6;
      const mode = attributes.preview_mode || 'grid';
      const prods = (DATA.products || []).slice(0, count);
      const cats = DATA.categories || [];
      const states = DATA.states || [];
      const totalCount = DATA.products ? DATA.products.length : 49;

      return el('div', { className: 'maxmobila-block-wrapper' },
        blockBadge('Catalog Produse MaxMobila'),
        el(InspectorControls, null,
          el(PanelBody, { title: 'Setări Previzualizare Editor', initialOpen: true },
            SelectControl ? el(SelectControl, {
              label: 'Mod Afișare în Editor',
              value: mode,
              options: [
                { label: 'Previzualizare Grilă Magazin', value: 'grid' },
                { label: 'Caseta Informativă Compactă', value: 'compact' }
              ],
              onChange: val => setAttributes({ preview_mode: val })
            }) : null,
            mode === 'grid' ? el(RangeControl, {
              label: 'Număr produse în previzualizare',
              value: count,
              onChange: val => setAttributes({ preview_count: val }),
              min: 2,
              max: 12,
              step: 2
            }) : null
          )
        ),
        mode === 'compact'
          ? el('div', {
              style: {
                background: '#fff',
                border: '1px solid var(--line)',
                borderRadius: '14px',
                padding: '28px',
                textAlign: 'center',
                boxShadow: 'var(--sh)'
              }
            },
              el('div', { style: { fontSize: '32px', marginBottom: '8px' } }, '🛍️'),
              el('h3', { style: { fontFamily: 'var(--fd)', fontSize: '20px', margin: '0 0 8px' } }, 'Catalog Interactiv Magazin'),
              el('p', { style: { color: 'var(--mut)', maxWidth: '580px', margin: '0 auto 16px', fontSize: '14px' } },
                'Pe site se încarcă automat catalogul complet cu ' + totalCount + ' de piese de mobilier, filtrele live pe categorii, stări și buget, bara de căutare și sortarea.'
              ),
              el('div', {
                style: {
                  display: 'inline-flex',
                  gap: '8px',
                  background: 'var(--soft)',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '12.5px',
                  fontWeight: 700
                }
              },
                el('span', null, 'Filtre active: 10 categorii · 4 stări · Căutare instant')
              )
            )
          : el('div', { className: 'wrap shop maxmobila-catalog-root' },
              el('aside', { className: 'filters' },
                el('h4', null, 'Categorie'),
                el('button', { className: 'opt on', type: 'button' }, 'Toate (' + totalCount + ')'),
                cats.slice(0, 5).map(c => el('button', { className: 'opt', key: c.id, type: 'button' }, c.name)),
                el('h4', null, 'Stare'),
                el('button', { className: 'opt on', type: 'button' }, 'Oricare'),
                states.map(s => el('button', { className: 'opt', key: s.id, type: 'button' }, s.name)),
                el('h4', null, 'Buget'),
                el('button', { className: 'opt on', type: 'button' }, 'Oricât'),
                el('button', { className: 'opt', type: 'button' }, 'până la 1.500 lei')
              ),
              el('div', null,
                el('div', { className: 'toolbar' },
                  el('b', null, totalCount + ' produse în stoc'),
                  el('span', { style: { color: 'var(--mut)', fontSize: '13px' } }, 'Sortare: Recomandate')
                ),
                el('div', { className: 'grid', style: { gridTemplateColumns: 'repeat(auto-fill,minmax(210px,1fr))' } },
                  prods.map(p => renderCard(p))
                )
              )
            )
      );
    },
    save: function() { return null; }
  });

  /* ========================================================
   * 8. CONTACT FORM & SHOWROOM
   * ======================================================== */
  registerBlockType('maxmobila/contact-form', {
    title: 'Formular Contact & Showroom (MaxMobila)',
    icon: 'email-alt',
    category: 'maxmobila',
    description: 'Formularul de contact și caseta de informații showroom',
    attributes: {
      title: { type: 'string', default: 'Programează o vizită sau pune o întrebare' }
    },
    edit: function(props) {
      const { attributes, setAttributes } = props;
      const store = DATA.store || {};

      return el('div', { className: 'maxmobila-block-wrapper' },
        blockBadge('Formular Contact & Detalii Showroom'),
        el('section', { className: 'sec', style: { paddingTop: '10px' } },
          el('div', { className: 'wrap two', style: { paddingBlock: 0 } },
            el('div', { className: 'panel' },
              el(RichText, {
                tagName: 'h3',
                value: attributes.title,
                onChange: val => setAttributes({ title: val }),
                placeholder: 'Titlu formular...'
              }),
              el('form', { className: 'frm' },
                el('div', null,
                  el('label', null, 'Nume *'),
                  el('input', { className: 'inp', placeholder: 'Maria Ionescu', disabled: true })
                ),
                el('div', null,
                  el('label', null, 'Telefon *'),
                  el('input', { className: 'inp', placeholder: '07xx xxx xxx', disabled: true })
                ),
                el('div', { className: 'full' },
                  el('label', null, 'Subiect'),
                  el('select', { className: 'inp', disabled: true },
                    el('option', null, 'Vreau să văd un produs în showroom')
                  )
                ),
                el('div', { className: 'full' },
                  el('label', null, 'Mesaj'),
                  el('textarea', { className: 'inp', rows: 3, placeholder: 'Mesajul dumneavoastră...', disabled: true })
                ),
                el('div', { className: 'full' },
                  el('button', { className: 'btn red block', type: 'button' }, 'Trimite mesajul')
                )
              )
            ),
            el('aside', { className: 'panel', style: { display: 'grid', gap: '14px' } },
              el('div', null,
                el('div', { className: 'eyebrow' }, 'Telefon'),
                el('div', { style: { font: '900 24px var(--fd)' } }, store.phone || '+40 700 000 000')
              ),
              el('div', null,
                el('div', { className: 'eyebrow' }, 'Email'),
                el('div', { style: { fontWeight: 800 } }, store.email || 'contact@maxmobila.ro')
              ),
              el('div', null,
                el('div', { className: 'eyebrow' }, 'Adresă'),
                el('div', { style: { fontWeight: 700 } }, store.address || 'Showroom & depozit, Satu Mare')
              ),
              el('div', null,
                el('div', { className: 'eyebrow' }, 'Program'),
                el('div', null, 'Luni–Vineri 9–18 · Sâmbătă 9–14')
              ),
              el('a', { className: 'btn outl', href: '#' }, '📍 Vezi pe Google Maps')
            )
          )
        )
      );
    },
    save: function() { return null; }
  });

  /* ========================================================
   * 9. COȘ DE CUMPĂRĂTURI
   * ======================================================== */
  registerBlockType('maxmobila/cos', {
    title: 'Coș Cumpărături (MaxMobila)',
    icon: 'cart',
    category: 'maxmobila',
    description: 'Previzualizare interfață coș de cumpărături',
    attributes: {},
    edit: function() {
      return el('div', { className: 'maxmobila-block-wrapper' },
        blockBadge('Modul Coș Cumpărături'),
        el('div', { className: 'wrap', style: { padding: '40px 20px', background: '#fff', borderRadius: '12px', border: '1px solid var(--line)', textAlign: 'center' } },
          el('h3', null, '🛒 Coșul tău de cumpărături'),
          el('p', { style: { color: 'var(--mut)' } }, 'Acest modul afișează automat produsele adăugate în coș de vizitator, calculul livrării și serviciilor de montaj.')
        )
      );
    },
    save: function() { return null; }
  });

  /* ========================================================
   * 10. FINALIZARE COMANDĂ
   * ======================================================== */
  registerBlockType('maxmobila/checkout', {
    title: 'Finalizare Comandă (MaxMobila)',
    icon: 'money-alt',
    category: 'maxmobila',
    description: 'Previzualizare interfață finalizare comandă (Checkout)',
    attributes: {},
    edit: function() {
      return el('div', { className: 'maxmobila-block-wrapper' },
        blockBadge('Modul Finalizare Comandă (Checkout)'),
        el('div', { className: 'wrap', style: { padding: '40px 20px', background: '#fff', borderRadius: '12px', border: '1px solid var(--line)', textAlign: 'center' } },
          el('h3', null, '💳 Formular Finalizare Comandă'),
          el('p', { style: { color: 'var(--mut)' } }, 'Afișează formularul pe o singură pagină pentru date client (persoană fizică/juridică), metodă de livrare și selecție plată.')
        )
      );
    },
    save: function() { return null; }
  });

})();
