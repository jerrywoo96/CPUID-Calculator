'use strict';

$(function () {

  // https://www.npmjs.com/package/cpuid-js
  // https://www.npmjs.com/package/cpuid-git
  // https://www.npmjs.com/package/cpuid

  function formatBin(bin) {
    return bin.includes(':') ? bin.split(':').map(c => c.padStart(4, '0')) : bin.padStart(32, '0').match(/.{1,4}/g);
  }

  function hexToBin(hex, join = '') {
    return hex.replaceAll('0x', '').padStart(8, '0').split('').map(c => parseInt(c, 16).toString(2).padStart(4, '0')).join(join);
  }

  function binToHex(bin, prefix = '') {
    return prefix + formatBin(bin).map(c => parseInt(c, 2).toString(16)).join('').padStart(8, '0');
  }

  function hexToString(hex) {
    return hex.replaceAll('0x', '').padStart(8, '0').match(/.{1,2}/g).reverse().map(c => String.fromCharCode(parseInt(c, 16))).join('');
  }

  function binToString(bin) {
    return hexToString(binToHex(bin));
  }

  function toBin(bin, join = '') {
    return formatBin(bin).join(join);
  }

  function toHex(hex, prefix = '') {
    return prefix + hex.replaceAll('0x', '').padStart(8, '0');
  }

  $('#fromLeaf0String').on('click', function () {
    const string = $('#LEAF0-string').val();
    const hexString = string.split('').map(c => c.charCodeAt(0).toString(16)).join('');

    const ebx = '0x' + hexString.substr(0, 8).match(/.{1,2}/g).reverse().join('');
    const ecx = '0x' + hexString.substr(16, 8).match(/.{1,2}/g).reverse().join('');
    const edx = '0x' + hexString.substr(8, 8).match(/.{1,2}/g).reverse().join('');

    $('#EBX0-hexString').val(ebx);
    $('#ECX0-hexString').val(ecx);
    $('#EDX0-hexString').val(edx);

    $('#EBX0-binString').val(hexToBin(ebx, ':'));
    $('#ECX0-binString').val(hexToBin(ecx, ':'));
    $('#EDX0-binString').val(hexToBin(edx, ':'));
  });

  $('#fromLeaf0Bin').on('click', function () {
    const ebx = $('#EBX0-binString').val();
    const ecx = $('#ECX0-binString').val();
    const edx = $('#EDX0-binString').val();
    $('#EBX0-hexString').val(binToHex(ebx, '0x'));
    $('#ECX0-hexString').val(binToHex(ecx, '0x'));
    $('#EDX0-hexString').val(binToHex(edx, '0x'));
    $('#LEAF0-string').val(binToString(ebx) + binToString(edx) + binToString(ecx));
  });

  $('#fromLeaf0Hex').on('click', function () {
    const ebx = $('#EBX0-hexString').val();
    const ecx = $('#ECX0-hexString').val();
    const edx = $('#EDX0-hexString').val();
    $('#EBX0-binString').val(hexToBin(ebx, ':'));
    $('#ECX0-binString').val(hexToBin(ecx, ':'));
    $('#EDX0-binString').val(hexToBin(edx, ':'));
    $('#LEAF0-string').val(hexToString(ebx) + hexToString(edx) + hexToString(ecx));
  });

  $('.fromBinString').on('click', function () {
    const bin = $(this).closest('tr').find('.binString').val();
    const hex = binToHex(bin);
    const rawBin = toBin(bin);
    const register = $(this).closest('.register');
    register.find('.hexString').val('0x' + hex);
    register.find('.binValues input').toArray().forEach((v, i) => v.value = rawBin[i]);
    register.find('.hexValues input').toArray().forEach((v, i) => v.value = hex[i]);

    if (register.data('register') === 'EAX1') { hexToEAX1(hex); }
  });

  $('.fromHexString').on('click', function () {
    const hex = $(this).closest('tr').find('.hexString').val();
    const bin = hexToBin(hex);
    const rawHex = toHex(hex);
    const register = $(this).closest('.register');
    register.find('.binString').val(toBin(bin, ':'));
    register.find('.binValues input').toArray().forEach((v, i) => v.value = bin[i]);
    register.find('.hexValues input').toArray().forEach((v, i) => v.value = rawHex[i]);

    if (register.data('register') === 'EAX1') { hexToEAX1(hex); }
  });

  $('.fromBinValues').on('click', function () {
    const bin = $(this).closest('tr').find('input').toArray().map(i => i.value).join('');
    const hex = binToHex(bin);
    const register = $(this).closest('.register');
    register.find('.binString').val(toBin(bin, ':'));
    register.find('.hexString').val('0x' + hex);
    register.find('.hexValues input').toArray().forEach((v, i) => v.value = hex[i]);

    if (register.data('register') === 'EAX1') { hexToEAX1(hex); }
  });

  $('.fromHexValues').on('click', function () {
    const hex = $(this).closest('tr').find('input').toArray().map(i => i.value).join('');
    const bin = hexToBin(hex);
    const register = $(this).closest('.register');
    register.find('.binString').val(toBin(bin, ':'));
    register.find('.hexString').val('0x' + hex);
    register.find('.binValues input').toArray().forEach((v, i) => v.value = bin[i]);

    if (register.data('register') === 'EAX1') { hexToEAX1(hex); }
  });

  function hexToEAX1(hex) {
    const bin = hexToBin(hex);
    const getHex = function (bin, pad = 1) {
      return parseInt(bin, 2).toString(16).padStart(pad, '0').toUpperCase();
    };
    const extendedFamilyId = getHex(bin.substr(4, 8));
    const extendedModelId = getHex(bin.substr(12, 4));
    const processorType = getHex(bin.substr(18, 2));
    const familyId = getHex(bin.substr(20, 4));
    const modelId = getHex(bin.substr(24, 4));
    const steppingId = getHex(bin.substr(28, 4));

    $('#EAX1-extendedFamilyId').val(extendedFamilyId);
    $('#EAX1-extendedModelId').val(extendedModelId);
    $('#EAX1-processorType').val(processorType);
    $('#EAX1-familyId').val(familyId);
    $('#EAX1-modelId').val(modelId);
    $('#EAX1-steppingId').val(steppingId);

    const modelIdDec = parseInt(modelId, 16);
    const familyIdDec = parseInt(familyId, 16);
    const extendedFamilyIdDec = parseInt(extendedFamilyId, 16);
    const actualFamily = familyIdDec === 15 ? extendedFamilyIdDec + familyIdDec : familyIdDec;
    const actualModel = ((familyIdDec === 6) || (familyIdDec === 15)) ? parseInt(extendedModelId + modelId, 16) : modelIdDec;

    $('#EAX1-actualFamilyId').val(actualFamily);
    $('#EAX1-actualModelId').val(actualModel);
  }

  $('.fromEAX1').on('click', function () {
    const reserved1 = $('#EAX1-reserved1').val().replaceAll('0x', '');
    const extendedFamilyId = $('#EAX1-extendedFamilyId').val().replaceAll('0x', '').padStart(2, '0');
    const extendedModelId = $('#EAX1-extendedModelId').val().replaceAll('0x', '');
    const reserved2 = $('#EAX1-reserved2').val().replaceAll('0x', '');
    const processorType = $('#EAX1-processorType').val().replaceAll('0x', '');
    const familyId = $('#EAX1-familyId').val().replaceAll('0x', '');
    const modelId = $('#EAX1-modelId').val().replaceAll('0x', '');
    const steppingId = $('#EAX1-steppingId').val().replaceAll('0x', '');

    const modelIdDec = parseInt(modelId, 16);
    const familyIdDec = parseInt(familyId, 16);
    const extendedFamilyIdDec = parseInt(extendedFamilyId, 16);
    const actualFamily = familyIdDec === 15 ? extendedFamilyIdDec + familyIdDec : familyIdDec;
    const actualModel = ((familyIdDec === 6) || (familyIdDec === 15)) ? parseInt(extendedModelId + modelId, 16) : modelIdDec;

    $('#EAX1-actualFamilyId').val(actualFamily);
    $('#EAX1-actualModelId').val(actualModel);

    const getBin = function (hex) {
      return parseInt(hex, 16).toString(2).padStart(2, '0');
    }

    const hex4 = parseInt(getBin(reserved2) + getBin(processorType), 2).toString(16);
    const hex = (reserved1 + extendedFamilyId + extendedModelId + hex4 + familyId + modelId + steppingId).toLowerCase();
    const bin = hexToBin(hex);

    const register = $(this).closest('.register');
    register.find('.binString').val(toBin(bin, ':'));
    register.find('.hexString').val('0x' + hex);
    register.find('.binValues input').toArray().forEach((v, i) => v.value = bin[i]);
    register.find('.hexValues input').toArray().forEach((v, i) => v.value = hex[i]);
  });

});
