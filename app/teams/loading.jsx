import ShimmerLoader from "@/app/components/ShimmerLoader"

const Loading = () => {
  return (
    <div className="py-10 dark:bg-gray-900 my-10 justify-center justify-items-centermx-auto">
        <ShimmerLoader title={'Loading Teams Detail Page ...'} />
    </div>
  )
}

export default Loading