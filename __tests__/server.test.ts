import { authSpeedyAgencyMember } from '@/app/api/utils/speedyagency';
import { encrypt, decrypt, generateHash } from '@/utils/tools'

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
    });

    it('decrypt', async function () {
        const encryptedData = 'NzQxNWYzOTYyNjZkODA3YjM4N2MyNDMxp3iSeaCBi1g0A5O9bHYo31XR2oy1tVVu3mp+3Jo8bWLkRx9yi5Q/gFh+u77EaK2+HJ5OF5ZZEJc=';
        const decryptedData = await decrypt(encryptedData)

        console.dir(decryptedData);

        expect(decryptedData).not.toBeNull()
    });

    it ("generateHash", async function() {
        const hash = await generateHash('1234567890');

        console.log(hash);

        expect(hash).not.toBeNull()
    });
})

