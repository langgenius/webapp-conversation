import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-gray-800">
            <h2 className="text-2xl font-bold mb-4">404 - Not Found</h2>
            <p className="mb-4">お探しのページは見つかりませんでした。</p>
            <Link href="/" className="text-blue-500 hover:underline">
                チャットへ戻る
            </Link>
        </div>
    )
}