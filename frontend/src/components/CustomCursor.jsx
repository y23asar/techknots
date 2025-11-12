import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) return;

    const cursorEl = cursorRef.current;
    const ringEl = ringRef.current;
    if (!cursorEl || !ringEl) return;

    const bodyEl = document.body;
    bodyEl.classList.add('tk-hide-native-cursor');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isHoveringInteractive = false;
    let raf;

    const interactiveSelectors = [
      'a[href]',
      'button',
      'summary',
      'label',
      'input:not([type="hidden"]):not(:disabled)',
      'textarea:not(:disabled)',
      'select:not(:disabled)',
      '[role="button"]',
      '[data-cursor="interactive"]',
    ].join(',');

    const findInteractive = (target) => {
      if (!target || !(target instanceof Element)) return null;
      return target.closest(interactiveSelectors);
    };

    const setCursor = (x, y) => {
      cursorEl.style.setProperty('--cursor-x', `${x}px`);
      cursorEl.style.setProperty('--cursor-y', `${y}px`);
    };

    const setRing = (x, y) => {
      ringEl.style.setProperty('--cursor-ring-x', `${x}px`);
      ringEl.style.setProperty('--cursor-ring-y', `${y}px`);
    };

    const show = () => {
      cursorEl.classList.add('tk-cursor-visible');
      ringEl.classList.add('tk-cursor-visible');
    };

    const hide = () => {
      cursorEl.classList.remove(
        'tk-cursor-visible',
        'tk-cursor-click',
        'tk-cursor-hover',
        'tk-cursor-active'
      );
      ringEl.classList.remove(
        'tk-cursor-visible',
        'tk-cursor-ring-click',
        'tk-cursor-ring-hover',
        'tk-cursor-ring-active'
      );
      cursorEl.style.setProperty('--cursor-scale', '1');
      ringEl.style.setProperty('--cursor-ring-scale', '1');
      isHoveringInteractive = false;
    };

    const updateHoverState = (shouldHover) => {
      if (shouldHover === isHoveringInteractive) return;
      isHoveringInteractive = shouldHover;
      if (shouldHover) {
        cursorEl.classList.add('tk-cursor-hover');
        ringEl.classList.add('tk-cursor-ring-hover');
      } else {
        cursorEl.classList.remove('tk-cursor-hover');
        ringEl.classList.remove('tk-cursor-ring-hover');
      }
    };

    const handleMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      setCursor(mouseX, mouseY);
      updateHoverState(Boolean(findInteractive(event.target)));
      show();
    };

    const handleDown = (event) => {
      cursorEl.classList.add('tk-cursor-click');
      ringEl.classList.add('tk-cursor-ring-click');
      if (findInteractive(event.target)) {
        cursorEl.classList.add('tk-cursor-active');
        ringEl.classList.add('tk-cursor-ring-active');
      }
    };

    const handleUp = () => {
      cursorEl.classList.remove('tk-cursor-click', 'tk-cursor-active');
      ringEl.classList.remove('tk-cursor-ring-click', 'tk-cursor-ring-active');
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      setRing(ringX, ringY);
      raf = requestAnimationFrame(animate);
    };

    setCursor(mouseX, mouseY);
    setRing(ringX, ringY);
    show();
    raf = requestAnimationFrame(animate);

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerdown', handleDown);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointerenter', show);
    window.addEventListener('pointerleave', hide);

    return () => {
      bodyEl.classList.remove('tk-hide-native-cursor');
      cancelAnimationFrame(raf);
      updateHoverState(false);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointerenter', show);
      window.removeEventListener('pointerleave', hide);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="tk-cursor-ring" aria-hidden="true" />
      <div ref={cursorRef} className="tk-cursor" aria-hidden="true" />
    </>
  );
}

