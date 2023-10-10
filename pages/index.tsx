import { NextPage } from 'next';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { motion } from 'framer-motion';
import Image from 'next/image';
import LineBreaks from '@/components/line-breaks';
import React, { useEffect } from 'react';
import Link from 'next/link';
import AnimatedText from 'react-animated-text-content';
import InstagramSection from '@/components/InstagramSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import { useAuth, useUser } from '@clerk/nextjs';

const Index: NextPage = () => {
  const { userId } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetch('/api/storeUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkUserID: userId,
          username: user?.username,
          email: user?.primaryEmailAddress?.emailAddress,
        }),
      }).then((res) => res.json());
    }
  }, [user, user?.primaryEmailAddress, user?.username, userId]);

  return (
    <>
      <div>
        <Head>
          <title>Virtue Gymnastics - We believe in movement for all</title>
          <meta name="description" content="Virtue Gymnastics" />
        </Head>
        <div className={styles.child}>
          <AnimatedText
            type={'chars'}
            animationType="throw"
            interval={0.06}
            duration={1}
            includeWhiteSpaces={true}
            className={styles.title}
          >
            Virtue
          </AnimatedText>
          <AnimatedText
            type={'chars'}
            animationType="throw"
            interval={0.06}
            duration={1}
            includeWhiteSpaces={true}
            className={styles.title}
          >
            Movement Co.
          </AnimatedText>
          <div className={styles.glow} />
        </div>
      </div>
      <div className={styles.homeButtons}>
        <Link href={'/students'}>
          <motion.button
            className={styles.buttonJoin}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            JOIN THE FAMILY
          </motion.button>
        </Link>
        <Link href={'/calendar'}>
          <motion.button
            className={styles.buttonTimetable}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            TIMETABLE
          </motion.button>
        </Link>
      </div>

      <div>
        <motion.img
          src={'/home/arrow.webp'}
          alt={''}
          width={200}
          height={200}
          className={styles.arrow}
          animate={{ x: [0, 20, 0], offset: 1, y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 10 }}
        />
        <motion.img
          src={'/home/other arrow.webp'}
          alt={''}
          width={75}
          height={75}
          className={styles.otherarrow}
          animate={{
            x: [0, 10, 0],
            y: [0, -10, 0],
            speed: 0.5,
          }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
        <motion.img
          src={'/home/double arrow.webp'}
          alt={''}
          width={30}
          height={30}
          className={styles.doublearrow}
          animate={{ x: [0, 50, 0], offset: 0.5 }}
          transition={{ repeat: Infinity, duration: 10 }}
        />
        <motion.img
          src={'/home/wave 1.webp'}
          alt={''}
          width={100}
          height={100}
          className={styles.wave1}
        />
        <motion.img
          src={'/home/wave 2.webp'}
          alt={''}
          width={200}
          height={200}
          className={styles.wave2}
        />
      </div>
      <br />
      <br />
      <div>
        <motion.img
          src={'/home/BELIEVE IN MOVEMENT.webp'}
          alt={''}
          width={200}
          height={200}
          className={styles.believeInMovement}
          animate={{
            rotate: [360, 0],
          }}
          transition={{ repeat: Infinity, duration: 20 }}
        />
      </div>
      <div className={'container'}>
        <Image
          src="/home/homeImage.webp"
          alt=""
          width={3000}
          height={3397}
          className={styles.homeImage}
        />
      </div>
      <LineBreaks />
      <div>
        <div className={'overflow-hidden'}>
          <motion.img
            src={'/home/dots.webp'}
            className={styles.dots1}
            alt={''}
            width={200}
          />
          <h2 className={styles.getToKnowUs}>GET TO KNOW US</h2>
          <motion.img
            src={'/home/dots.webp'}
            className={styles.dots2}
            alt={''}
            width={200}
          />
        </div>
        <h5 className={styles.textGetToKnowUs}>
          Virtue aims to provide opportunities for all! Our members will
          progress to reach their highest individual standard, in a fun safe,
          protective environment. Our mission is to increase all round strength,
          co ordination, agility, balance and fitness whilst enjoying every
          second. We believe every one can achieve, which in turn fosters
          confidence, self-discipline and motivation. We believe in movement for
          all!
        </h5>
        <motion.img
          src={'/home/double arrow bold.webp'}
          alt={''}
          width={50}
          className={styles.doubleArrowBold}
        />
        <div className={styles.glow2}></div>
      </div>
      <InstagramSection />
      <TestimonialsSection />
    </>
  );
};

export default Index;
