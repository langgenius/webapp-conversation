import { authSpeedyAgencyMember } from '@/app/api/utils/speedyagency';
import { encrypt, decrypt } from '@/utils/tools'

describe("Test Server", () => {
    it('authSpeedyAgencyMember', async function () {
        const channel = await authSpeedyAgencyMember('11111111');

        console.log(channel);

        expect(channel).toEqual("aia")
    });

    it('encrypt', async function () {
        const encryptedData = await encrypt({
            first: "First",
            Three: "3",
        })

        console.log(encryptedData);

        expect(encryptedData).not.toBeNull()
    })

    it('decrypt', async function () {
        const encryptedData = 'N2M0NGNlZDJiMjRlMmFmNTQwMWIxZGZiTFlA5Al/mcPLvtSD/56Xgzl8+C9GCukkrI8AxyB6LeYfE57b1APZbdPcFD5w';
        const decryptedData = await decrypt(encryptedData)

        console.dir(decryptedData);

        expect(decryptedData).not.toBeNull()
    })
})

