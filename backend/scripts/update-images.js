const mongoose = require('mongoose');

// Reliable Unsplash product images mapped to each product
const imageUpdates = [
  {
    id: '6a0ddf52a55b1777f19629fb',
    title: 'Structured Wool Blazer',
    imageCover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiQNFXL2ANS9D0OJQ6oY7FqWQOS4lmQef2qjwvuOSpx7jMyfw749Hz3A5iuyJPEKFHS57UPnQSSW1gqMgEzKYJHpI7BbhVGnJVZGTKrLJkF_tNCyuDZNngpVUwvFKjpxaWWC9mVtlAwCwvGNspsG5cxfFweqQqjaQ0ufmY47PBqKO94n8bm7jywsoemj9UCq6C9bmquO-iXDYAcPJG1LCOFDLdxb5kRMeukGKdeUH8AEdCsFa0GXW_fN776TcvTaMYYGgat8vfwNY'
  },
  {
    id: '6a0ddf52a55b1777f19629fe',
    title: 'Draped Silk Midi',
    imageCover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApo-C0sfCRCKDXznGHvH3_XbRSK0kg9aVUkL1lIRQ8GhNPskGqnubzBZ8shR94_XHh_E19-_eiRBLJJPkjYi9tS4KVVcZzuPBgUOHdPthVbd_GucSJL3UYvJ4tByVHylyydXJwf7hyXXx98-BG-4jvpdQShvkqXHs3VZDugXFbWyHWp0kxnLcMHRr6FQUFjPS9VTbQxuKx13Y4gR20WWBPb5M3yyDyeQWTfjHj0g5vZFzb34JFTlNjH5jK7pnZndcuPftyR6-3Z1E'
  },
  {
    id: '6a0ddf52a55b1777f19629fc',
    title: 'Architectural Tote',
    imageCover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDr9J81ffoVRdywQE6Tv4433Aaa2N9wzmOKw5kxWJ-Xjpf4U2rsSgHLz9NdMHCQ0qwbkuGxoOAbBZKSQuM5nZxTRQoCkpv1iGNgO-AvK5Y6Yi7GnhSt8wjcVIosZIQOubhRWNU_18XoVIpvS6j5cgnmAzLwvVEq_Jn-ZBNUKr1SDhqnLwV8n0PQwqL7WJqImlUb7r4dzmcVjMrabIg6GBS-oY8gAmZzWXbWfeuCm4HdeIxqsLr2UFEMphOqo5nuN7B6RCAay34MmI'
  },
  {
    id: '6a0ddf52a55b1777f19629fd',
    title: 'Brushed Gold Cuff',
    imageCover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDg_hv73pzKiH7nulFTtDwyy2AUDZNZw4kLWcGUapwqUflDwrnp_3ZtEALpnM1DYx7bw16F9JPFcgRkQEqK9Aj09xsKL00-1Y5qIfY-Og9DuX8IPmx3VONfmdKgabyUnRKq8f9paBgTvN-1waibUtrFvzhzLTPYSQPuCxNRV493ncMFSzDSmEFFRcq39EGb8M_IVrdwXrqQkk5XWn62B8LUqggFx8_bQrMMM2AOxjF1PJBkm09xo0vGgtKljmx-cWzz2l1iS3IwlGs'
  },
  {
    id: '6a0ddf52a55b1777f1962a01',
    title: 'Textured Ceramic Vase',
    imageCover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqTpu-FiuszM3NEzoMKO0VFmJZhkLX8xR493OAuuFdgZWcF6rgDkaQsVtzDi57a35KPBqltJM6FseAIadRD1mogVc26q0Z3lFoNdL5WhYmhWCi2IdxwVw2gN2gcOebb-xciB1n0kxuZjSwlflSth6AzEb-Syv1T6X-9f3pih9NJXP2_sCjmWe6x6g9RI5rwML-ATQ8l4sIOtHiuQOw5xyDpPkTDDP6QwWMJCFzAcRZjVDVmF8vVRXED66MH35s6Qwv8vxl4dsQrgA'
  },
  {
    id: '6a0ddf52a55b1777f1962a02',
    title: 'Silk Trench Coat',
    imageCover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATfBiQSeoa-ilA0ryUV-QkMqxuY8PcRVPCAY3D5CB66YWUJKJuURiIxZkxQl1VNhkpzmnjXZuftia2DsoM7bLotV_xFCSdOJQRJSb1ScXwveQJe8Jv4QjC9-8AgPK3Io3CRhlT5fAn8TGw5Hqvhv71tZS90resgR1VIweWgTdix-pDKRst8EHyfl4AHOHZcKKU78mlj-cCKdfKv7BIoSkMog8F5l997dpFEwb-uJ30BN0pSCXKRBENzBW2HcnBul3LFXfAox31AzE'
  },
  {
    id: '6a0ddf52a55b1777f1962a03',
    title: 'Long-Sleeve Knit Sweater',
    imageCover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgZxkxJCDqFcO15kPkejozEKZWJywgYA1H54NMeZKU_KZmbYeXqOi6DgBCZUgNIfTzreN_x7U1vHySzgX9ZGN3oLFE9chAMMaHA3agbAi4TaV7MfefE6tWQYmHGDLUstpZ3ifgh02VKoKWwLlGHndqRSBYLf55KcpCHK4vm-RfB1p_HSSTZokwscIqZ0nqLFZw3lHOHSWy640praWukB2rZJO9iQwbsG6o64gWyCHtboXDQzrPJ5xB4WZrgACnyDbBRdkW9ZSojdU'
  },
  {
    id: '6a0ddf52a55b1777f1962a04',
    title: 'Oversized Poplin Shirt',
    imageCover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiuBX8b8LMlhzKKTddvn5-jovrB86o4x-c4-6abKSUQkl4I5vkrEowTbxe815kUOJbzBqmkZ9DixgoEJDfVBUh-38Bf11_KUsCM6D0aYsLENfPLVfXcaCxH0ft_8EWp4BuqOiArxzLcMmBoQl0F3jHd0FxHFuKb99WhpWSJ2GocazGALj6dFVjKJUBYxQ77oajAKmcbny851G3jkEvOcq2168ANv2ZTZnzl3K_xQMytIFRscgqTG6Js-oSkqJad6XailgoCEUKGKk'
  },
  {
    id: '6a0ddf52a55b1777f19629ff',
    title: 'Tailored Wide-Leg Trousers',
    imageCover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANxj125L5LMGuOXUbzBWLEvPl7rjpfNMdxHi5-gQ48ifilZneLULlF3jeu0UKr_N5uGFNUYL6ZuME-TmoLhY7ZotFMl66Jb66dshRQgUfKfLhVv6bmsEX0dpIXRPX34FDUinyqrGoy8VUzWf29l6gNPPBvzkTYEky5PNyFnfO-n79C42-Rw3DwaLJq_rHWhhXR52v7Vqn2Cg1-Tiiixcvqsy2jysnv5jjp3b0r8xNlLBFlyVOTi43ryfCHqTUTVyUNyzVSkF5_qPo'
  },
  {
    id: '6a0ddf52a55b1777f1962a00',
    title: 'Sheer Cashmere Scarf',
    imageCover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHriNKRXQrpEc_7V0Ry-ZTHYllR8kaXImq_BCq5AWWS2dgSeGe9T64nCgGUADwDEKSnNVxx_lPKlHlUJcYR8PlSThQZ47mwKyNzMqL2GtleT90eta_aY2LKOTsoJ7TIHcytUikilB99d0lspBmgFnuSVSALMJ4pZ1zmdG0rZb6iR0a5eOb2U3YBcTkD-Vab81TMali2CtfoeVYte_t_KbKki2d2ayVLSax_sfjUJJap1SBvJYy1ZRTAY3y676w02SKHMGGRZbv_Nk'
  }
];

async function updateImages() {
  await mongoose.connect('mongodb://127.0.0.1/INETechs');
  console.log('Connected to MongoDB');

  const collection = mongoose.connection.db.collection('products');

  for (const item of imageUpdates) {
    const result = await collection.updateOne(
      { _id: new mongoose.Types.ObjectId(item.id) },
      { $set: { imageCover: item.imageCover } }
    );
    console.log(`✅ ${item.title}: ${result.modifiedCount ? 'Updated' : 'No change'}`);
  }

  console.log('\n🎉 All product images updated successfully!');
  process.exit(0);
}

updateImages().catch(err => { console.error(err); process.exit(1); });
